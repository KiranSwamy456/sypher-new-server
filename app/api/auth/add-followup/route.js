import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

async function addFollowupHandler(request) {
  try {
    const { registrationId, notes } = await request.json();
    const userId = request.user.userId;

    console.log('Adding followup for registration:', registrationId, 'by user:', userId);

    if (!registrationId || !notes) {
      return NextResponse.json(
        { error: 'Registration ID and notes are required' },
        { status: 400 }
      );
    }

    // Check if user is assigned to this registration - MySQL syntax
    const registrationCheck = await query(
      'SELECT assignee_id FROM registrations WHERE id = ?',
      [registrationId]
    );

    console.log('Registration check result length:', registrationCheck.length);

    // MySQL returns direct array, not result.rows
    if (registrationCheck.length === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    const registration = registrationCheck[0]; // Changed from registrationCheck.rows[0]

    // Only assigned user can add notes (unless admin with role 602 or 603)
    if (registration.assignee_id !== userId && ![602, 603].includes(request.user.roleCode)) {
      return NextResponse.json(
        { error: 'You can only add notes to your assigned registrations' },
        { status: 403 }
      );
    }

    // Add follow-up note - MySQL syntax with ? placeholders
    const result = await query(
      `INSERT INTO registration_followups (registration_id, user_id, notes, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [registrationId, userId, notes]
    );

    console.log('Followup inserted with ID:', result.insertId);

    // MySQL returns insertId, not rows array
    return NextResponse.json({
      success: true,
      message: 'Follow-up note added successfully',
      followupId: result.insertId
    });

  } catch (error) {
    console.error('Add followup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(addFollowupHandler);
