import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    console.log("=== Middleware Check ===");
    console.log("Path:", pathname);
    console.log("Token:", token ? `Exists (roleCode: ${token.roleCode})` : "Missing");

    // Check if user is authenticated
    if (!token) {
      console.log("❌ No token, redirecting to /sign-in");
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Check role for admin routes
    if (pathname.startsWith("/admin")) {
      const allowedRoles = [602, 603]; // Admin and Super Admin
      if (!allowedRoles.includes(token.roleCode)) {
        console.log("❌ Role not authorized:", token.roleCode);
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
      console.log("✅ Admin access granted for role:", token.roleCode);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("Middleware authorized callback - token exists:", !!token);
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
