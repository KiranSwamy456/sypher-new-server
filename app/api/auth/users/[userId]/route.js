import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

async function getUserHandler(request, context) {
  try {
    const userId = context.params.userId;
    console.log('Fetching user ID:', userId);

    // Only get active users where is_active = 0
    const result = await query(
      'SELECT id, name, email, role_code, mobile_number, city, pincode, is_active,  created_at FROM users WHERE id = ? AND is_active = 0',
      [userId]
    );

    console.log('User query result length:', result.length);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// UPDATE user
async function updateUserHandler(request, context) {
  console.log('=== UPDATE USER HANDLER START ===');
  console.log('Context params:', context.params);
  console.log('Request method:', request.method);
  
  try {
    const userId = context.params.userId; // Changed from userid to userId
    console.log('Extracted userId:', userId);
    
    const requestBody = await request.json();
    console.log('Raw request body:', JSON.stringify(requestBody, null, 2));
    
    const { name, email, password, role_code, mobile_number, city, pincode } = requestBody;
    console.log('Destructured fields:', { name, email, role_code, mobile_number, city, pincode });
    
    if (!name || !email) {
      console.log('Validation failed: missing name or email');
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    const validRoleCode = role_code || 601;
    console.log('Valid role code:', validRoleCode);
    
    // Check if email exists for other users
    console.log('Checking email uniqueness...');
    const emailCheck = await query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    );
    console.log('Email check result:', emailCheck);
    
    if (emailCheck.length > 0) {
      console.log('Email already exists');
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    let updateQuery;
    let params;
    
    if (password && password.trim() !== '') {
      console.log('Updating with password');
      updateQuery = `
        UPDATE users 
        SET name = ?, email = ?, password = ?, role_code = ?, 
            mobile_number = ?, city = ?, pincode = ?, updated_at = NOW()
        WHERE id = ?
      `;
      params = [name, email, password, validRoleCode, mobile_number || null, city || null, pincode || null, userId];
    } else {
      console.log('Updating without password');
      updateQuery = `
        UPDATE users 
        SET name = ?, email = ?, role_code = ?, mobile_number = ?, 
            city = ?, pincode = ?, updated_at = NOW()
        WHERE id = ?
      `;
      params = [name, email, validRoleCode, mobile_number || null, city || null, pincode || null, userId];
    }
    
    console.log('Query:', updateQuery);
    console.log('Params:', params);
    
    const result = await query(updateQuery, params);
    console.log('Update result:', result);
    
    if (result.affectedRows === 0) {
      console.log('No rows affected - user not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('Fetching updated user...');
    const updatedUser = await query(
      'SELECT id, name, email, role_code, mobile_number, city, pincode FROM users WHERE id = ?',
      [userId]
    );
    console.log('Updated user:', updatedUser[0]);
    
    console.log('=== UPDATE USER HANDLER SUCCESS ===');
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser[0]
    });
    
  } catch (error) {
    console.log('=== UPDATE USER HANDLER ERROR ===');
    console.error('Update user error:', error);
    console.error('Error stack:', error.stack);
    console.log('=== END ERROR ===');
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

    

// SOFT DELETE user (set is_active to 1)
async function deleteUserHandler(request, context) {
  try {
    const userId = context.params.userId;
    console.log('Soft deleting user ID:', userId);

    // Soft delete: set is_active to 1 instead of deleting
    const result = await query(
      'UPDATE users SET is_active = 1, updated_at = NOW() WHERE id = ? AND is_active = 0',
      [userId]
    );

    console.log('Soft delete result affected rows:', result.affectedRows);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'User not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getUserHandler);
export const PUT = requireAdmin(updateUserHandler);
export const DELETE = requireAdmin(deleteUserHandler);
