import bcrypt from 'bcryptjs';
import { query } from '../lib/db.js';

async function createAdmin() {
  try {
    const password = 'admin123'; // Change this to your desired password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await query(
      `INSERT INTO users (name, email, password, role_code, mobile_number, city, pincode) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      ['Admin User', 'admin@sypher.com', hashedPassword, 602, '9999999999', 'Test City', '123456']
    );
    
    console.log('Admin user created with ID:', result.rows[0].id);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();