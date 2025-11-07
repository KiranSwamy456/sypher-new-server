// File: lib/generateInvoicePDF.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

export async function generateInvoicePDF(invoiceData) {
  const doc = new jsPDF();
  
  const { invoice_number, invoice_date, student, items, subtotal, registration_fee, total_amount, sessions } = invoiceData;

  // Colors
  const primaryColor = [255, 193, 7]; // Yellow
  const darkColor = [33, 37, 41];
  const grayColor = [108, 117, 125];

  // Header - CUSTOMER INVOICE
  doc.setFillColor(...primaryColor);
  doc.rect(15, 10, 60, 10, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('CUSTOMER INVOICE', 17, 17);

  // Invoice Number
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(`Invoice No: ${invoice_number}`, 15, 28);

  // Company Logo (right side) - BIGGER SIZE
  try {
    const logoPngPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
    
    if (fs.existsSync(logoPngPath)) {
      const logoData = fs.readFileSync(logoPngPath);
      const logoBase64 = logoData.toString('base64');
      doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', 145, 10, 50, 25);
    } else {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('SYPHER ACADEMY', 140, 20);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('UNLOCK YOUR POTENTIAL', 148, 25);
    }
  } catch (error) {
    console.error('Error loading logo:', error);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SYPHER ACADEMY', 140, 20);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('UNLOCK YOUR POTENTIAL', 148, 25);
  }

  // BILL TO Section Header
  doc.setFillColor(...primaryColor);
  doc.rect(15, 35, 25, 8, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('BILL TO', 17, 41);

  // BILL TO Table - Same style as TUTORING SERVICES
  const billToTableData = [[
    student.parent_name,
    student.student_name,
    student.student_id,
    student.phone || 'N/A',
    student.email || 'N/A',
    `$${registration_fee}`
  ]];

  autoTable(doc, {
    startY: 45,
    head: [['Parent Name', 'Student Name', 'Student ID', 'Phone', 'Email', 'Registration Fee']],
    body: billToTableData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [52, 58, 64], textColor: [255, 255, 255], fontStyle: 'bold' },
    margin: { left: 15, right: 15 }
  });

  const billToEndY = doc.lastAutoTable.finalY + 10;

  // TUTORING SERVICES Section
  doc.setFillColor(...primaryColor);
  doc.rect(15, billToEndY, 60, 8, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('TUTORING SERVICES', 17, billToEndY + 6);

  // Tutoring Services Table with Category, Subject, Start Date columns
  const tableData = items.map(item => [
    item.category || 'N/A',
    item.subject,
    item.session_start_date ? new Date(item.session_start_date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }) : 'N/A',
    item.class_type || student.class_type,
    item.sessions,
    `$${item.rate_per_session.toFixed(2)}`,
    `$${item.amount.toFixed(2)}${registration_fee > 0 ? '*' : ''}`
  ]);

  autoTable(doc, {
    startY: billToEndY + 10,
    head: [['Category', 'Subject', 'Start Date', 'Class Type', 'Sessions (hrs)', 'Rate/Session', 'Total Amount ($)']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [52, 58, 64], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 22 },  // Category
      1: { cellWidth: 28 },  // Subject
      2: { cellWidth: 24 },  // Start Date
      3: { cellWidth: 26 },  // Class Type
      4: { cellWidth: 20 },  // Sessions
      5: { cellWidth: 26 },  // Rate/Session
      6: { cellWidth: 34 }   // Total Amount
    },
    margin: { left: 15, right: 15 }
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // PAYMENT INSTRUCTIONS
  doc.setFillColor(...primaryColor);
  doc.rect(15, finalY, 75, 8, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('PAYMENT INSTRUCTIONS', 17, finalY + 6);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);
  doc.text('Make Check Payable to', 15, finalY + 16);
  doc.setFont('helvetica', 'bold');
  doc.text('Sypher Academy LLC', 15, finalY + 22);
  
  doc.setFont('helvetica', 'normal');
  doc.text('OR', 15, finalY + 28);
  
  // Zelle - TWO LINES
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text('Zelle (input this email address in place of phone number,', 15, finalY + 34);
  doc.text('admin@sypheracademy.com)', 15, finalY + 40);

  // Add QR Code on RIGHT SIDE - BIGGER SIZE
  try {
    const qrPath = path.join(process.cwd(), 'public', 'images', 'payment-qr.png');
    
    if (fs.existsSync(qrPath)) {
      const qrData = fs.readFileSync(qrPath);
      const qrBase64 = qrData.toString('base64');
      doc.addImage(`data:image/png;base64,${qrBase64}`, 'PNG', 150, finalY + 15, 45, 45);
    }
  } catch (error) {
    console.error('Error loading QR code:', error);
  }

  // Payment due - Bold and Italic
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(9);
  doc.text('Payment due within 3 days of invoice date or prior to start date.', 15, finalY + 50);
  doc.text('* registration fee incl.', 15, finalY + 56);

  // Contact Information
  doc.setFillColor(...primaryColor);
  doc.rect(15, finalY + 64, 180, 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Contact Sypher Academy LLC regarding questions or clarifications', 17, finalY + 70);

  // Email and Website on SINGLE LINE
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('Email Address:', 15, finalY + 80);
  doc.setFont('helvetica', 'normal');
  doc.text('admin@sypheracademy.com', 42, finalY + 80);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Website:', 100, finalY + 80);
  doc.setFont('helvetica', 'normal');
  doc.text('www.sypheracademy.com', 117, finalY + 80);

  // Save PDF to file system
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'invoices');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `${invoice_number}.pdf`;
  const filePath = path.join(uploadsDir, fileName);

  fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));

  return `/api/invoices/${fileName}`;
}
