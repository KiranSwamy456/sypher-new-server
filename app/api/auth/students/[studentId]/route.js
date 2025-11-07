import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET single student
async function getStudentHandler(request, context) {
  try {
    const studentId = context.params.studentId;
    console.log('Fetching student ID:', studentId);

    const result = await query(
      'SELECT * FROM students WHERE id = ? AND is_active = 0 AND status = 0',
      [studentId]
    );

    console.log('Student query result length:', result.length);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student: result[0]
    });
  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE student
async function updateStudentHandler(request, context) {
  try {
    const studentId = context.params.studentId;
    console.log('Updating student ID:', studentId);
    
    const body = await request.json();
    console.log('Update student body:', body);
    
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
      selected_courses,
      subjectDetails,
      subject_details
    } = body;
    
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
    const finalSubjectDetails = subjectDetails || subject_details;
    
    if (!finalParentName || !finalStudentName) {
      return NextResponse.json(
        { error: 'Parent name and student name are required' },
        { status: 400 }
      );
    }
    
    const categoriesJson = finalSelectedCategories 
      ? (typeof finalSelectedCategories === 'string' ? finalSelectedCategories : JSON.stringify(finalSelectedCategories))
      : null;
    const subjectsJson = finalSelectedSubjects 
      ? (typeof finalSelectedSubjects === 'string' ? finalSelectedSubjects : JSON.stringify(finalSelectedSubjects))
      : null;
    const coursesJson = finalSelectedCourses 
      ? (typeof finalSelectedCourses === 'string' ? finalSelectedCourses : JSON.stringify(finalSelectedCourses))
      : null;
    const subjectDetailsJson = finalSubjectDetails
      ? (typeof finalSubjectDetails === 'string' ? finalSubjectDetails : JSON.stringify(finalSubjectDetails))
      : null;
    
    const result = await query(`
      UPDATE students 
      SET parent_name = ?, lives_in = ?, contacted_via = ?, student_name = ?,
          student_grade = ?, school_name = ?, phone = ?, email = ?,
          assignee_id = ?, referred_by = ?, notes = ?, 
          selected_categories = ?, selected_subjects = ?, selected_courses = ?,
          subject_details = ?,
          updated_at = NOW()
      WHERE id = ? AND is_active = 0
    `, [
      finalParentName, finalLivesIn, finalContactedVia, finalStudentName, finalStudentGrade, 
      finalSchoolName, phone, email, finalAssigneeId || null, finalReferredBy, notes,
      categoriesJson, subjectsJson, coursesJson, subjectDetailsJson,
      studentId
    ]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Student updated successfully'
    });
    
  } catch (error) {
    console.error('Update student error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// SOFT DELETE student (set is_active to 1)
async function deleteStudentHandler(request, context) {
  try {
    const studentId = context.params.studentId;
    console.log('Soft deleting student ID:', studentId);
    
    const result = await query(
      'UPDATE students SET is_active = 1, updated_at = NOW() WHERE id = ? AND is_active = 0',
      [studentId]
    );
    
    console.log('Soft delete result affected rows:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Student not found or already deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete student error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getStudentHandler);
export const PUT = requireAdmin(updateStudentHandler);
export const DELETE = requireAdmin(deleteStudentHandler);
