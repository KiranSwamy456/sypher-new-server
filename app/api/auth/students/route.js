// File: app/api/students/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withAdmin } from '@/lib/nextAuthMiddleware';

// GET all students (only active students with status = 0 and is_active = 0)
async function getStudentsHandler(request) {
  try {
    console.log('Fetching students from database...');
    console.log('Authenticated admin user:', request.user.email, 'Role:', request.user.roleCode);
    
    // Fetch students with their invoices
    const result = await query(`
      SELECT 
        s.*,
        u.name as assignee_name,
        GROUP_CONCAT(
          CONCAT(i.invoice_number, '|', i.pdf_path) 
          ORDER BY i.created_at DESC 
          SEPARATOR '||'
        ) as invoices_data
      FROM students s
      LEFT JOIN users u ON s.assignee_id = u.id
      LEFT JOIN invoices i ON s.id = i.student_id AND i.is_active = 0
      WHERE s.status = 0 AND s.is_active = 0
      GROUP BY s.id
      ORDER BY s.id DESC
    `);
    
    console.log('Active students fetched:', result.length);
    
    // Process each student to parse JSON fields and invoices
    const processedStudents = await Promise.all(
      result.map(async (student) => {
        // Parse JSON strings back to arrays
        const categories = student.selected_categories ? JSON.parse(student.selected_categories) : [];
        const subjects = student.selected_subjects ? JSON.parse(student.selected_subjects) : [];
        const courseIds = student.selected_courses ? JSON.parse(student.selected_courses) : [];
        
        // Parse invoices
        let invoices = [];
        if (student.invoices_data) {
          invoices = student.invoices_data.split('||').map(inv => {
            const [invoice_number, pdf_path] = inv.split('|');
            return { invoice_number, pdf_path };
          });
        }
        
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
          course_details: courses,
          invoices: invoices // Add invoices to student object
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

export const GET = withAdmin(getStudentsHandler);
