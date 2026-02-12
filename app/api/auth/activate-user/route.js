import { query } from "@/lib/db";

export async function POST(req) {
  try {
    const { email, isActive } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await query(
      "UPDATE users SET is_active = ? WHERE email = ?",
      [isActive ? 1 : 0, email]
    );

    console.log("User status updated:", { email, isActive, result });

    return Response.json({
      success: true,
      message: `User ${email} is now ${isActive ? "active" : "inactive"}`,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    // Activate kiranswamy.cb@gmail.com (set is_active = 0 to mean active)
    const email = "kiranswamy.cb@gmail.com";
    await query("UPDATE users SET is_active = 0 WHERE email = ?", [email]);

    return Response.json({
      success: true,
      message: `User ${email} has been activated`,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
