import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

async function getUsersHandler(request) {
  try {
    console.log('Fetching users from database...');
    console.log('Authenticated admin user:', request.user.email, 'Role:', request.user.roleCode);
    
    // Only fetch active users where is_active = 0
    const result = await query(`
      SELECT 
        id, name, email, role_code, mobile_number, city, pincode, created_at
      FROM users 
      WHERE is_active = 0
      ORDER BY id ASC
    `);
    
    console.log('Active users fetched:', result.length);
    
    return NextResponse.json({
      success: true,
      users: result,
      count: result.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getUsersHandler);
