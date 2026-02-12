import { query } from "@/lib/db";

export async function GET(req) {
  try {
    const email = "kiranswamy.cb@gmail.com";
    
    const result = await query(
      "SELECT id, name, email, status, role_code FROM users WHERE email = ?",
      [email]
    );

    console.log("Database check for email:", email);
    console.log("Result:", result);

    return Response.json({
      success: true,
      email: email,
      found: result.length > 0,
      user: result.length > 0 ? result[0] : null,
      allUsers: await query("SELECT id, name, email, role_code, status FROM users LIMIT 10"),
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
