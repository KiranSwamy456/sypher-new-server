// File: app/api/admin/rate-cards/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

async function getRateCardsHandler(request) {
  try {
    // Fetch only active rate cards (is_active = 0)
    const rateCards = await query(
      `SELECT * FROM rate_cards 
       WHERE is_active = 0 
       ORDER BY subject, grade_range, class_type`
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

export const GET = requireAdmin(getRateCardsHandler);
