// File: app/api/students/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET all students (only active students with status = 0 and is_active = 0)
async function getStudentsHandler(request) {
  try {
    console.log('Fetching students from database...');
    console.log('Authenticated admin user:', request.user.email, 'Role:', request.user.roleCode);
    
    // Only fetch students where status = 0 AND is_active = 0
    const result = await query(`
      SELECT 
        s.*,
        u.name as assignee_name
      FROM students s
      LEFT JOIN users u ON s.assignee_id = u.id
      WHERE s.status = 0 AND s.is_active = 0
      ORDER BY s.id DESC
    `);
    
    console.log('Active students fetched:', result.length);
    
    // Process each student to parse JSON fields
    const processedStudents = await Promise.all(
      result.map(async (student) => {
        // Parse JSON strings back to arrays
        const categories = student.selected_categories ? JSON.parse(student.selected_categories) : [];
        const subjects = student.selected_subjects ? JSON.parse(student.selected_subjects) : [];
        const courseIds = student.selected_courses ? JSON.parse(student.selected_courses) : [];
        
        // Fetch course details if there are course IDs
        let courses = [];
        if (courseIds && courseIds.length > 0) {
          try {
            const placeholders = courseIds.map(() => '?').join(',');
            const courseResults = await query(
              `SELECT id, course_name FROM courses WHERE id IN (${placeholders})`,
              courseIds
            );
            courses = courseResults.map(c => ({
              id: c.id,
              name: c.course_name
            }));
          } catch (error) {
            console.error('Error fetching course details:', error);
          }
        }
        
        return {
          ...student,
          selected_categories: categories,
          selected_subjects: subjects,
          selected_courses: courseIds,
          course_details: courses
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      students: processedStudents,
      count: processedStudents.length
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getStudentsHandler);
