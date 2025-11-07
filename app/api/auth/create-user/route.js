import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

async function createUserHandler(request) {
  try {
    const { name, email, password, roleCode = 601, mobileNumber, city, pincode } = await request.json();

    console.log('Creating user:', { name, email, roleCode });

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Store password as plain text (TEMPORARY - NOT SECURE)
    console.log('Storing password as plain text - remember to add hashing later');

    // Insert user with plain text password
    const result = await query(
      `INSERT INTO users (name, email, password, role_code, mobile_number, city, pincode, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, email, password, roleCode, mobileNumber || null, city || null, pincode || null]
    );

    console.log('User created with ID:', result.insertId);

    // Get the created user details
    const newUser = await query(
      'SELECT id, name, email, role_code, mobile_number, city, pincode, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser[0]
    });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(createUserHandler);
