import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = params;

  const [rows] = await db.query(
    "SELECT * FROM parent_student_registrations WHERE id = ?",
    [id],
  );

  return Response.json({ student: rows[0] });
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  await db.query(
    `UPDATE parent_student_registrations 
     SET student_name=?, student_email=?, category=?, subjects=? 
     WHERE id=?`,
    [body.student_name, body.student_email, body.category, body.subjects, id],
  );

  return Response.json({ success: true });
}

export async function DELETE(req, { params }) {
  const { id } = params;

  await db.query(
    `UPDATE parent_student_registrations 
     SET is_active=0 
     WHERE id=?`,
    [id],
  );

  return Response.json({ success: true });
}
