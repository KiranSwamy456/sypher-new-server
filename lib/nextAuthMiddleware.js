import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export function withAuth(handler) {
  return async (request, context) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized - Please login" },
          { status: 401 }
        );
      }

      // Add session to request for use in handler
      request.user = session.user;
      return await handler(request, context);
    } catch (error) {
      console.error("withAuth error:", error);
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 500 }
      );
    }
  };
}

export function withAdmin(handler) {
  return async (request, context) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized - Please login" },
          { status: 401 }
        );
      }

      // Check if user has admin role (602 or 603)
      if (![602, 603].includes(session.user.roleCode)) {
        return NextResponse.json(
          { error: "Forbidden - Admin access required" },
          { status: 403 }
        );
      }

      // Add session to request for use in handler
      request.user = session.user;
      return await handler(request, context);
    } catch (error) {
      console.error("withAdmin error:", error);
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 500 }
      );
    }
  };
}
