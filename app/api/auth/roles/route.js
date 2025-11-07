import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

async function getRolesHandler(request) {
  try {
    console.log('Fetching roles from database...');
    
    const result = await query(`
      SELECT role_code, role_name, description, is_active
      FROM roles 
      WHERE is_active = true
      ORDER BY role_code ASC
    `);

    console.log('Roles found:', result.length);

    return NextResponse.json({
      success: true,
      roles: result, // MySQL returns direct array, not result.rows
      count: result.length
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getRolesHandler);
