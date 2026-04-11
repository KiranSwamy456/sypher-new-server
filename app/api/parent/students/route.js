import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    console.log("SESSION IN API:", session);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentId = session.user.id;

    const [rows] = await db.query(
      `SELECT * FROM parent_student_registrations 
       WHERE parent_id = ? AND is_active = 0`,
      [parentId]
    );

    return Response.json({ students: rows });

  } catch (error) {
    console.error("API ERROR:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}