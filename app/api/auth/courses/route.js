import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

async function getCoursesHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentCategory = searchParams.get('parent_category');
    const subjectCategory = searchParams.get('subject_category');
    const grade = searchParams.get('grade');

    console.log('Fetching courses with filters:', { parentCategory, subjectCategory, grade });

    let whereClause = 'WHERE is_active = 1';
    let params = [];

    if (parentCategory) {
      whereClause += ' AND parent_category = ?';
      params.push(parentCategory);
    }

    if (subjectCategory) {
      whereClause += ' AND subject_category = ?';
      params.push(subjectCategory);
    }

    if (grade) {
      whereClause += ' AND (grade_number = ? OR grade_number IS NULL)';
      params.push(grade);
    }

    const result = await query(`
      SELECT 
        id, course_name, category, parent_category, subject_category, 
        subject, grade_number, course_level, is_active, created_at
      FROM courses 
      ${whereClause}
      ORDER BY parent_category, subject_category, course_name ASC
    `, params);

    console.log('Courses found:', result.length);

    return NextResponse.json({
      success: true,
      courses: result,
      count: result.length,
      filters: { parentCategory, subjectCategory, grade }
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getCoursesHandler);
