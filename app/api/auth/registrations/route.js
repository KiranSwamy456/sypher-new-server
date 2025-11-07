import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

async function getRegistrationsHandler(request) {
  try {
    console.log('Fetching registrations from database...');
    
       const result = await query(`
      SELECT
        r.*,
        u.name as assignee_name
      FROM registrations r
      LEFT JOIN users u ON r.assignee_id = u.id
      WHERE r.status = 0 AND r.is_active = 0
      ORDER BY r.id ASC
    `);
 
    console.log('Registrations fetched:', result.length);
    
    // Process each registration to parse JSON and fetch course details
    const processedRegistrations = await Promise.all(
      result.map(async (reg) => {
        // Parse JSON strings back to arrays
        const categories = reg.selected_categories ? JSON.parse(reg.selected_categories) : [];
        const subjects = reg.selected_subjects ? JSON.parse(reg.selected_subjects) : [];
        const courseIds = reg.selected_courses ? JSON.parse(reg.selected_courses) : [];
        
        // Fetch course details if there are course IDs
        let courses = [];
        if (courseIds && courseIds.length > 0) {
          try {
            // Create placeholders for the SQL IN clause
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
          ...reg,
          selected_categories: categories,
          selected_subjects: subjects,
          selected_courses: courseIds,
          course_details: courses // Add the actual course names
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      registrations: processedRegistrations,
      count: processedRegistrations.length
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getRegistrationsHandler);
