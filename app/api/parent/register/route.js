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
      contactedVia,
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

    /**
     * 1️⃣ Insert Parent 
     
    const parentResult = await query(
      `INSERT INTO parent_registration 
      (parent_name, parent_email, lives_in, connected_via)
      VALUES (?, ?, ?, ?)`,
      [parentName, parentEmail, livesIn, contactedVia]
    );

    const parentId = parentResult.insertId;

    console.log("Parent created:", parentId); */

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
        523262
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
        `INSERT INTO student_parent_registration
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