// File: app/api/auth/admin/rate-cards/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withAdmin } from '@/lib/nextAuthMiddleware';

async function getRateCardsHandler(request) {
  try {
    // Fetch active rate cards with user info who updated
    const rateCards = await query(
      `SELECT 
        rc.*,
        u.name as updated_by_name
       FROM rate_cards rc
       LEFT JOIN users u ON rc.updated_by = u.id
       WHERE rc.is_active = 0 
       ORDER BY rc.subject, rc.grade_range, rc.class_type`
    );

    return NextResponse.json({
      success: true,
      rateCards: rateCards
    });
  } catch (error) {
    console.error('Get rate cards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rate cards', details: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getRateCardsHandler);
