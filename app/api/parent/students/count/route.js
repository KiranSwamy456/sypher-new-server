import { NextResponse } from 'next/server';
import db from '@/lib/db'; // your DB connection

export async function GET(req) {
  try {
    // Example: get parent_id from query or session
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get('parent_id');

    if (!parentId) {
      return NextResponse.json({
        success: false,
        message: 'Parent ID is required'
      }, { status: 400 });
    }

    const [rows] = await db.execute(
      `SELECT COUNT(*) AS total_students 
       FROM parent_student_registrations 
       WHERE parent_id = ? AND is_active = 1`,
      [parentId]
    );

    return NextResponse.json({
      success: true,
      totalStudents: rows[0].total_students
    });

  } catch (error) {
    console.error('Error fetching student count:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}