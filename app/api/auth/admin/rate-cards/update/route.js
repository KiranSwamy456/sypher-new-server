// File: app/api/auth/admin/rate-cards/update/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function updateRateCardHandler(request) {
  try {
    const { rateCardId, newPrice, updateReason } = await request.json();

    // Validation
    if (!rateCardId || !newPrice) {
      return NextResponse.json(
        { error: 'Rate card ID and new price are required' },
        { status: 400 }
      );
    }

    if (newPrice <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate reason
    if (!updateReason || updateReason.trim() === '') {
      return NextResponse.json(
        { error: 'Reason for update is required' },
        { status: 400 }
      );
    }

    // Get current user ID from JWT token
    let userId = null;
    try {
      const cookieStore = cookies();
      const token = cookieStore.get('token')?.value;
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId || decoded.id;
      }
    } catch (error) {
      console.error('Error getting user from token:', error);
    }

    console.log('User ID from token:', userId); // Debug log

    // 1. Get the current rate card
    const currentRateCard = await query(
      'SELECT * FROM rate_cards WHERE id = ? AND is_active = 0',
      [rateCardId]
    );

    if (currentRateCard.length === 0) {
      return NextResponse.json(
        { error: 'Rate card not found or already inactive' },
        { status: 404 }
      );
    }

    const rateCard = currentRateCard[0];

    // 2. Check if price actually changed
    if (parseFloat(newPrice) === parseFloat(rateCard.price_per_session)) {
      return NextResponse.json(
        { error: 'New price is same as current price' },
        { status: 400 }
      );
    }

    // 3. Disable the old rate card (set is_active = 1)
    await query(
      'UPDATE rate_cards SET is_active = 1, updated_at = NOW() WHERE id = ?',
      [rateCardId]
    );

    // 4. Create new rate card with updated price, user ID, and reason
    const result = await query(
      `INSERT INTO rate_cards 
       (subject, grade_range, class_type, price_per_session, is_active, updated_by, update_reason, created_at, updated_at) 
       VALUES (?, ?, ?, ?, 0, ?, ?, NOW(), NOW())`,
      [
        rateCard.subject,
        rateCard.grade_range,
        rateCard.class_type,
        newPrice,
        userId, // This will be the user ID from JWT
        updateReason.trim()
      ]
    );

    console.log('New rate card created with ID:', result.insertId, 'by user:', userId); // Debug log

    return NextResponse.json({
      success: true,
      message: 'Rate card updated successfully',
      oldRateCardId: rateCardId,
      newRateCardId: result.insertId,
      newPrice: newPrice,
      updatedBy: userId,
      reason: updateReason.trim()
    });

  } catch (error) {
    console.error('Update rate card error:', error);
    return NextResponse.json(
      { error: 'Failed to update rate card', details: error.message },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(updateRateCardHandler);
