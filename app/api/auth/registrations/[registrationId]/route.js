import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET single registration
async function getRegistrationHandler(request, context) {
  try {
    const registrationId = context.params.registrationId;
    console.log('Fetching registration ID:', registrationId);

    const result = await query(`
      SELECT 
        r.*,
        u.name as assignee_name
      FROM registrations r
      LEFT JOIN users u ON r.assignee_id = u.id
      WHERE r.id = ?
    `, [registrationId]);

    console.log('Query result length:', result.length);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      registration: result[0]
    });
  } catch (error) {
    console.error('Get registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


async function updateRegistrationHandler(request, context) {
  try {
    const registrationId = context.params.registrationId;
    
    // Read the request body ONLY ONCE
    const body = await request.json();
    console.log('Update registration body:', body);
    
    // Check if this is a convert-to-student request
    if (body.convertToStudent === true) {
      console.log('Converting registration to student:', registrationId);
      
      try {
        // 1. Get the registration data
        const registrationResult = await query(
          'SELECT * FROM registrations WHERE id = ? AND status = 0 AND is_active = 0',
          [registrationId]
        );
        
        if (registrationResult.length === 0) {
          return NextResponse.json(
            { error: 'Registration not found or already converted' },
            { status: 404 }
          );
        }
        
        const registration = registrationResult[0];
        console.log('Found registration:', registration.student_name);
        
        // 2. Check if student already exists with same email or phone
        if (registration.email || registration.phone) {
          const existingStudent = await query(
            'SELECT id FROM students WHERE (email = ? OR phone = ?) AND is_active = 0',
            [registration.email || '', registration.phone || '']
          );
          
          if (existingStudent.length > 0) {
            return NextResponse.json(
              { error: 'Student with this email or phone already exists' },
              { status: 409 }
            );
          }
        }
        
        // 3. Insert data into students table
        const insertResult = await query(`
          INSERT INTO students (
            registration_id, parent_name, lives_in, contacted_via, 
            student_name, student_grade, school_name, phone, email,
            assignee_id, referred_by, notes, selected_categories, 
            selected_subjects, selected_courses, enrollment_date, 
            student_status, status, is_active, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'active', 0, 0, NOW())
        `, [
          registrationId,
          registration.parent_name,
          registration.lives_in,
          registration.contacted_via,
          registration.student_name,
          registration.student_grade,
          registration.school_name,
          registration.phone,
          registration.email,
          registration.assignee_id,
          registration.referred_by,
          registration.notes,
          registration.selected_categories,
          registration.selected_subjects,
          registration.selected_courses
        ]);
        
        const studentId = insertResult.insertId;
        console.log('Student created with ID:', studentId);
        
        // 4. Update registration status to converted (status = 1)
        await query(
          'UPDATE registrations SET status = 1, updated_at = NOW() WHERE id = ?',
          [registrationId]
        );
        
        console.log('Registration status updated to converted');
        console.log('Registration successfully converted to student');
        
        return NextResponse.json({
          success: true,
          message: 'Registration converted to student successfully',
          studentId: studentId
        });
        
      } catch (error) {
        console.error('Conversion error:', error);
        throw error;
      }
    }
    
    // Regular update logic (non-conversion)
    // Destructure from the already-read body
    // Support both camelCase and snake_case for flexibility
    const {
      parentName,
      parent_name,
      livesIn,
      lives_in,
      contactedVia,
      contacted_via,
      studentName,
      student_name,
      studentGrade,
      student_grade,
      schoolName,
      school_name,
      phone,
      email,
      assigneeId,
      assignee_id,
      referredBy,
      referred_by,
      notes,
      selectedCategories,
      selected_categories,
      selectedSubjects,
      selected_subjects,
      selectedCourses,
      selected_courses
    } = body;
    
    // Use camelCase if available, otherwise fall back to snake_case
    const finalParentName = parentName || parent_name;
    const finalLivesIn = livesIn || lives_in;
    const finalContactedVia = contactedVia || contacted_via;
    const finalStudentName = studentName || student_name;
    const finalStudentGrade = studentGrade || student_grade;
    const finalSchoolName = schoolName || school_name;
    const finalAssigneeId = assigneeId || assignee_id;
    const finalReferredBy = referredBy || referred_by;
    const finalSelectedCategories = selectedCategories || selected_categories;
    const finalSelectedSubjects = selectedSubjects || selected_subjects;
    const finalSelectedCourses = selectedCourses || selected_courses;
    
    if (!finalParentName || !finalStudentName) {
      return NextResponse.json(
        { error: 'Parent name and student name are required' },
        { status: 400 }
      );
    }
    
    // Convert arrays to JSON strings
    // Handle case where data might already be JSON string
    const categoriesJson = finalSelectedCategories 
      ? (typeof finalSelectedCategories === 'string' ? finalSelectedCategories : JSON.stringify(finalSelectedCategories))
      : null;
    const subjectsJson = finalSelectedSubjects 
      ? (typeof finalSelectedSubjects === 'string' ? finalSelectedSubjects : JSON.stringify(finalSelectedSubjects))
      : null;
    const coursesJson = finalSelectedCourses 
      ? (typeof finalSelectedCourses === 'string' ? finalSelectedCourses : JSON.stringify(finalSelectedCourses))
      : null;
    
    const result = await query(`
      UPDATE registrations 
      SET parent_name = ?, lives_in = ?, contacted_via = ?, student_name = ?,
          student_grade = ?, school_name = ?, phone = ?, email = ?,
          assignee_id = ?, referred_by = ?, notes = ?, 
          selected_categories = ?, selected_subjects = ?, selected_courses = ?,
          updated_at = NOW()
      WHERE id = ? AND is_active = 0
    `, [
      finalParentName, finalLivesIn, finalContactedVia, finalStudentName, finalStudentGrade, 
      finalSchoolName, phone, email, finalAssigneeId || null, finalReferredBy, notes,
      categoriesJson, subjectsJson, coursesJson, registrationId
    ]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Registration updated successfully'
    });
    
  } catch (error) {
    console.error('Update registration error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE registration
// SOFT DELETE registration (set is_active to 1)
async function deleteRegistrationHandler(request, context) {
  try {
    const registrationId = context.params.registrationId;
    console.log('Soft deleting registration ID:', registrationId);
    
    // Soft delete: set is_active to 1 instead of deleting
    const result = await query(
      'UPDATE registrations SET is_active = 1, updated_at = NOW() WHERE id = ? AND is_active = 0',
      [registrationId]
    );
    
    console.log('Soft delete result affected rows:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Registration not found or already deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getRegistrationHandler);
export const PUT = requireAdmin(updateRegistrationHandler);
export const DELETE = requireAdmin(deleteRegistrationHandler);
