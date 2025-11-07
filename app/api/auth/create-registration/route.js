import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

async function createRegistrationHandler(request) {
  try {
    console.log('=== Creating new registration ===');
    
    const body = await request.json();
    console.log('Full request body:', JSON.stringify(body, null, 2));
    
    const {
      parentName,
      livesIn,
      contactedVia,
      studentName,
      studentGrade,
      schoolName,
      phone,
      email,
      assigneeId,
      referredBy,
      notes,
      selectedCategories,
      selectedSubjects,
      selectedCourses,
    } = body;
    
    console.log('Extracted data:');
    console.log('- Categories:', selectedCategories);
    console.log('- Subjects:', selectedSubjects);
    console.log('- Courses:', selectedCourses);
    
    if (!parentName || !studentName) {
      return NextResponse.json(
        { error: 'Parent name and student name are required' },
        { status: 400 }
      );
    }
    
    if (!selectedCategories || selectedCategories.length === 0) {
      return NextResponse.json(
        { error: 'At least one category must be selected' },
        { status: 400 }
      );
    }
    
    if (!selectedSubjects || selectedSubjects.length === 0) {
      return NextResponse.json(
        { error: 'At least one subject must be selected' },
        { status: 400 }
      );
    }
    
    // Convert arrays to JSON strings for storage
    const categoriesJson = JSON.stringify(selectedCategories);
    const subjectsJson = JSON.stringify(selectedSubjects);
    const coursesJson = selectedCourses && selectedCourses.length > 0 
      ? JSON.stringify(selectedCourses) 
      : null;
    
    console.log('JSON strings to be saved:');
    console.log('- categoriesJson:', categoriesJson);
    console.log('- subjectsJson:', subjectsJson);
    console.log('- coursesJson:', coursesJson);
    
    // MySQL syntax with ? placeholders
    const sqlQuery = `INSERT INTO registrations (
      parent_name, lives_in, contacted_via, student_name, 
      student_grade, school_name, phone, email, 
      assignee_id, referred_by, notes, 
      selected_categories, selected_subjects, selected_courses,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    const params = [
      parentName, 
      livesIn, 
      contactedVia, 
      studentName, 
      studentGrade, 
      schoolName, 
      phone, 
      email, 
      assigneeId || null, 
      referredBy, 
      notes,
      categoriesJson,
      subjectsJson,
      coursesJson
    ];
    
    console.log('SQL Query:', sqlQuery);
    console.log('Parameters:', params);
    
    const result = await query(sqlQuery, params);
    
    console.log('Registration created successfully with ID:', result.insertId);
    
    // Verify the data was saved correctly
    const verification = await query(
      'SELECT * FROM registrations WHERE id = ?',
      [result.insertId]
    );
    
    console.log('Verification - Data saved in DB:', JSON.stringify(verification[0], null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Registration created successfully',
      registrationId: result.insertId,
      data: {
        categories: selectedCategories,
        subjects: selectedSubjects,
        courses: selectedCourses || []
      },
      savedData: verification[0] // Include saved data for debugging
    });
  } catch (error) {
    console.error('=== Registration creation error ===');
    console.error('Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(createRegistrationHandler);
