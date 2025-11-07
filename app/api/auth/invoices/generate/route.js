// File: app/api/auth/invoices/generate/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

async function generateInvoiceHandler(request) {
  try {
    const { studentId, selectedSubjects } = await request.json();
    console.log('Generating invoice for student:', studentId);
    console.log('Selected subjects:', selectedSubjects);

    // Validate input
    if (!selectedSubjects || selectedSubjects.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one subject' },
        { status: 400 }
      );
    }

    // 1. Get student details
    const studentResult = await query(
      `SELECT s.*, u.name as assignee_name 
       FROM students s 
       LEFT JOIN users u ON s.assignee_id = u.id 
       WHERE s.id = ? AND s.is_active = 0`,
      [studentId]
    );

    if (studentResult.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const student = studentResult[0];

    // 2. Parse subject_details
    let subjectDetails = [];
    try {
      subjectDetails = student.subject_details ? JSON.parse(student.subject_details) : [];
    } catch (e) {
      console.error('Error parsing subject_details:', e);
      return NextResponse.json(
        { error: 'Invalid subject details format' },
        { status: 400 }
      );
    }

    // Parse selected_categories to map subjects to categories
    let selectedCategories = [];
    try {
      selectedCategories = student.selected_categories ? JSON.parse(student.selected_categories) : [];
    } catch (e) {
      console.error('Error parsing selected_categories:', e);
      selectedCategories = [];
    }

    // 3. Filter subject details for selected subjects only
    // Match by BOTH subject name AND category AND session_start_date to handle duplicate subject names
    const selectedSubjectDetails = subjectDetails.filter(sd => {
      // Check if selectedSubjects contains objects (new format) or strings (old format)
      if (selectedSubjects.length > 0 && typeof selectedSubjects[0] === 'object') {
        // New format: array of complete subject objects
        return selectedSubjects.some(selected => 
          selected.subject === sd.subject && 
          selected.category === sd.category &&
          selected.session_start_date === sd.session_start_date
        );
      } else {
        // Old format: array of subject names (fallback for compatibility)
        return selectedSubjects.includes(sd.subject);
      }
    });

    if (selectedSubjectDetails.length === 0) {
      return NextResponse.json(
        { error: 'No valid subject details found for selected subjects' },
        { status: 400 }
      );
    }

    // Validate that all selected subjects have required fields
    for (const sd of selectedSubjectDetails) {
      if (!sd.session_start_date || !sd.number_of_sessions || !sd.class_type) {
        return NextResponse.json(
          { error: `Incomplete session details for subject: ${sd.subject}` },
          { status: 400 }
        );
      }
    }

    // 4. Get student grade for rate card matching
    const studentGrade = student.student_grade;

    // Determine grade range for rate card
    let gradeRange = '';
    const gradeNum = parseInt(studentGrade);
    if (gradeNum >= 1 && gradeNum <= 8) {
      gradeRange = 'Grade 1 to 8';
    } else if (gradeNum >= 9 && gradeNum <= 11) {
      gradeRange = 'Grade 9 to 11';
    }

    // 5. Fetch rates for each selected subject from rate_cards
    const invoiceItems = [];
    let subtotal = 0;

    for (const subjectDetail of selectedSubjectDetails) {
      const subject = subjectDetail.subject;
      const numberOfSessions = parseInt(subjectDetail.number_of_sessions);
      const classType = subjectDetail.class_type;

      // Map subject to rate card subject category
      let subjectCategory = '';
      
      if (subject.toLowerCase().includes('math') || 
          subject.toLowerCase().includes('algebra') || 
          subject.toLowerCase().includes('geometry') ||
          subject.toLowerCase().includes('calculus')) {
        subjectCategory = 'MATH';
      } else if (subject.toLowerCase().includes('science') || 
                 subject.toLowerCase().includes('physics') || 
                 subject.toLowerCase().includes('chemistry') ||
                 subject.toLowerCase().includes('biology')) {
        subjectCategory = 'SCIENCE';
      } else if (subject.toLowerCase().includes('english') || 
                 subject.toLowerCase().includes('language')) {
        subjectCategory = 'ENGLISH';
      } else if (subject.toLowerCase().includes('sat') || 
                 subject.toLowerCase().includes('act') || 
                 subject.toLowerCase().includes('psat')) {
        subjectCategory = 'COLLEGE TESTS';
      }

      // Fetch rate from rate_cards
      const rateResult = await query(
        `SELECT price_per_session 
         FROM rate_cards 
         WHERE subject = ? 
         AND grade_range = ? 
         AND class_type = ? 
         AND is_active = 0
         LIMIT 1`,
        [subjectCategory, gradeRange, classType]
      );

      let ratePerSession = 0;
      if (rateResult.length > 0) {
        ratePerSession = parseFloat(rateResult[0].price_per_session);
      } else {
        // Default rate if not found
        ratePerSession = 25.00;
      }

      const amount = ratePerSession * numberOfSessions;
      subtotal += amount;

      invoiceItems.push({
        subject: subject,
        category: subjectDetail.category,
        sessions: numberOfSessions,
        rate_per_session: ratePerSession,
        amount: amount,
        session_start_date: subjectDetail.session_start_date,
        class_type: classType
      });
    }

    // 6. Calculate registration fee (only if ALL subjects combined < 70 sessions)
    const totalSessions = invoiceItems.reduce((sum, item) => sum + item.sessions, 0);
    const registrationFee = totalSessions < 70 ? 25.00 : 0.00;
    const totalAmount = subtotal + registrationFee;

    // 7. Generate invoice number
    const latestInvoice = await query(
      `SELECT invoice_number FROM invoices ORDER BY id DESC LIMIT 1`
    );

    let sequentialNumber = 101;
    if (latestInvoice.length > 0) {
      const lastNumber = latestInvoice[0].invoice_number.split('-').pop();
      sequentialNumber = parseInt(lastNumber) + 1;
    }

    // Get first letter of first subject
    const firstSubject = typeof selectedSubjects[0] === 'object' 
      ? selectedSubjects[0].subject 
      : selectedSubjects[0];
    const subjectCode = firstSubject.substring(0, 3).toUpperCase();
    const firstLetter = student.student_name.charAt(0).toUpperCase();
    
    const invoiceNumber = `SA-${firstLetter}-${subjectCode}-${sequentialNumber}`;

    // 8. Calculate due date (15 days from invoice date)
    const invoiceDate = new Date();
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 15);

    // 9. Create invoice record
    const createdBy = request.user?.id || null;
    
    const invoiceResult = await query(
      `INSERT INTO invoices (
        invoice_number, student_id, invoice_date, due_date, 
        subtotal, registration_fee, total_amount, payment_status,
        created_by, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, 0)`,
      [
        invoiceNumber,
        studentId,
        invoiceDate.toISOString().split('T')[0],
        dueDate.toISOString().split('T')[0],
        subtotal.toFixed(2),
        registrationFee.toFixed(2),
        totalAmount.toFixed(2),
        createdBy
      ]
    );

    const invoiceId = invoiceResult.insertId;

    // 10. Create invoice items
    for (const item of invoiceItems) {
      await query(
        `INSERT INTO invoice_items (
          invoice_id, subject, sessions, rate_per_session, amount
        ) VALUES (?, ?, ?, ?, ?)`,
        [invoiceId, item.subject, item.sessions, item.rate_per_session, item.amount]
      );
    }

    // 11. Generate and save PDF
    // Use the earliest session start date for the invoice
    const earliestStartDate = invoiceItems.reduce((earliest, item) => {
      const itemDate = new Date(item.session_start_date);
      return itemDate < earliest ? itemDate : earliest;
    }, new Date(invoiceItems[0].session_start_date));

    const { generateInvoicePDF } = await import('@/lib/generateInvoicePDF');
    const pdfPath = await generateInvoicePDF({
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate.toISOString().split('T')[0],
      student: {
        parent_name: student.parent_name,
        student_name: student.student_name,
        student_id: `2025-09-A${sequentialNumber}`,
        phone: student.phone,
        email: student.email,
        session_start_date: earliestStartDate.toISOString().split('T')[0],
        class_type: invoiceItems[0].class_type,
        notes: student.notes
      },
      items: invoiceItems,
      subtotal: subtotal,
      registration_fee: registrationFee,
      total_amount: totalAmount,
      sessions: totalSessions
    });

    // 12. Update invoice with PDF path
    await query(
      `UPDATE invoices SET pdf_path = ? WHERE id = ?`,
      [pdfPath, invoiceId]
    );

    // 13. Return invoice data
    return NextResponse.json({
      success: true,
      message: 'Invoice generated successfully',
      invoice: {
        id: invoiceId,
        invoice_number: invoiceNumber,
        pdf_path: pdfPath
      }
    });

  } catch (error) {
    console.error('Generate invoice error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(generateInvoiceHandler);
