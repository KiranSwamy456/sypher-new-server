import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    console.log("=== Add Student API ===");

    // 🔐 GET SESSION (NEXTAUTH WAY)
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parent_id = session.user.id; // ✅ FIXED

    const body = await request.json();

    const { studentName, studentEmail, categories = [], subjects = [] } = body;

    if (!studentName || !studentEmail) {
      return NextResponse.json(
        { error: "Student name and email required" },
        { status: 400 },
      );
    }

    // 🔴 GLOBAL duplicate check
    const existingEmail = await query(
      `SELECT id FROM parent_student_registrations WHERE student_email = ?`,
      [studentEmail],
    );

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: "Student email already exists" },
        { status: 400 },
      );
    }

    // INSERT
    const result = await query(
      `INSERT INTO parent_student_registrations
      (parent_id, student_name, student_email, category, subjects, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        parent_id,
        studentName,
        studentEmail,
        categories.join(","),
        subjects.join(","),
      ],
    );

    return NextResponse.json({
      success: true,
      studentId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}
