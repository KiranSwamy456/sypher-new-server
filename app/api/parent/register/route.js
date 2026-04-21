import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    console.log("=== Parent Registration API ===");

    const body = await request.json();

    const {
      parentName,
      parentEmail,
      password,
      phone,
      livesIn,
      pincode,
      students
    } = body;

    if (!parentName || !parentEmail) {
      return NextResponse.json(
        { error: "Parent name and email are required" },
        { status: 400 }
      );
    }

    if (!students || students.length === 0) {
      return NextResponse.json(
        { error: "At least one student is required" },
        { status: 400 }
      );
    }

    // ✅ Check if parent email already exists
    const existingUser = await query(
      `SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1`,
      [parentEmail]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Parent email already exists" },
        { status: 400 }
      );
    }

    const existingPhone = await query(
      `SELECT id FROM users WHERE mobile_number = ? LIMIT 1`,
      [phone]
    );

    if (existingPhone.length > 0) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }    
    const studentEmails = students.map(s => s.studentEmail);
    const placeholders = studentEmails.map(() => "?").join(",");

    const existingStudents = await query(
      `SELECT student_email FROM parent_student_registrations 
      WHERE student_email IN (${placeholders})`,
      studentEmails
    );

    if (existingStudents.length > 0) {
      return NextResponse.json(
        { error: "One or more student emails already exist" },
        { status: 400 }
      );
    }
    const emailSet = new Set(studentEmails);

    if (emailSet.size !== studentEmails.length) {
      return NextResponse.json(
        { error: "Duplicate student emails in request" },
        { status: 400 }
      );
    }
    const result = await query(
      `INSERT INTO users 
      (name, email, password, role_code, mobile_number, city, pincode, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        parentName,
        parentEmail,
        password,
        605,     // or your role code constant
        phone || null,
        livesIn || null,
        pincode || null
      ]
    );

    const parentID = result.insertId;
    console.log("===== User (Parent) created:", result);
    console.log("User (Parent) created:", parentID);

    
    /**
     * 2️⃣ Insert Students
     */
    for (const student of students) {

      const category = student.categories.join(",");
      const subjects = student.subjects.join(",");

      await query(
        `INSERT INTO parent_student_registrations
        (parent_id, student_name, student_email, category, subjects)
        VALUES (?, ?, ?, ?, ?)`,
        [
          parentID,
          student.studentName,
          student.studentEmail,
          category,
          subjects
        ]
      );
    }
    console.log("===== Insert Students", result);
    return NextResponse.json({
      success: true,
      message: "Parent and students registered successfully",
      parentId: parentID,
      studentsCount: students.length
    });

  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message
      },
      { status: 500 }
    );
  }
}