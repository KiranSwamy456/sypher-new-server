import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    // Verify authentication first
    const authResult = await requireAuth(async (req) => {
      return { user: req.user };
    })(request);

    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error
    }

    const registrationId = params.registrationId;
    const userId = request.user?.userId;
    const roleCode = request.user?.roleCode;

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching followups for registration ID:', registrationId);
    console.log('User ID:', userId, 'Role:', roleCode);

    // Check if user has access to this registration - MySQL syntax
    const registrationCheck = await query(
      'SELECT assignee_id FROM registrations WHERE id = ?',
      [registrationId]
    );

    // MySQL returns direct array, not result.rows
    if (registrationCheck.length === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    const registration = registrationCheck[0]; // Changed from registrationCheck.rows[0]

    // Only assigned user or admin can view notes (support both admin roles)
    if (registration.assignee_id !== userId && ![602, 603].includes(roleCode)) {
      return NextResponse.json(
        { error: 'You can only view notes for your assigned registrations' },
        { status: 403 }
      );
    }

    // Get all follow-up notes for this registration - MySQL syntax
    const result = await query(`
      SELECT 
        rf.*,
        u.name as user_name
      FROM registration_followups rf
      JOIN users u ON rf.user_id = u.id
      WHERE rf.registration_id = ?
      ORDER BY rf.created_at DESC
    `, [registrationId]);

    console.log('Followups found:', result.length);

    return NextResponse.json({
      success: true,
      followups: result // Changed from result.rows
    });

  } catch (error) {
    console.error('Get followups error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
