import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

export async function POST(request) {
  console.log('LOGIN API CALLED - CODE UPDATED!');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const result = await query('SELECT * FROM users WHERE email = ?', [email]);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result[0];
    const isValidPassword = password === user.password;

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, roleCode: user.role_code, name: user.name },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, roleCode: user.role_code },
      token: token
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
