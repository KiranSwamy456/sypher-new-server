import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required");
          }

          // Find user in database
          const result = await query(
            "SELECT * FROM users WHERE email = ?",
            [credentials.email]
          );

          if (result.length === 0) {
            throw new Error("Invalid credentials");
          }

          const user = result[0];

          // Check if user is active
          if (user.is_active === 1) {
            throw new Error("Account inactive");
          }

          // Check password - compare plain text (or implement proper hashing)
          const isValidPassword = credentials.password === user.password;
          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          }

          // Allow  admin , super admin roles and parent (602, 603 , 605)e
          if (![602, 603, 605].includes(user.role_code)) {
            throw new Error("Access denied for this role");
          }

          // Return user object for JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            roleCode: user.role_code,
            image: null,
          };
        } catch (error) {
          console.error("Credentials auth error:", error.message);
          throw error;
        }
      },
    }),
  ],
  
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const userEmail = user.email;
        console.log("=== Google SignIn Callback ===");
        console.log("User email:", userEmail);
        console.log("User name:", user.name);
        console.log("User image:", user.image);

        // Check if user exists in database
        const result = await query("SELECT * FROM users WHERE email = ?", [
          userEmail,
        ]);

        console.log("Database query result:", result);

        if (result.length === 0) {
          console.log("❌ User not found in database:", userEmail);
          // Return string to trigger error page redirect
          return "/sign-in?error=EmailNotValidated";
        }

        const dbUser = result[0];
        console.log("Database user:", {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          is_active: dbUser.is_active,
          role_code: dbUser.role_code,
        });

        // Validate user is active (is_active = 0 means active, is_active = 1 means inactive)
        if (dbUser.is_active === 1) {
          console.log("❌ User account is inactive:", userEmail);
          return "/sign-in?error=AccountInactive";
        }

        // Allow only admin and super admin roles (602, 603)
        if (![602, 603, 605].includes(dbUser.role_code)) {
          console.log("❌ User role not authorized:", dbUser.role_code);
          return "/sign-in?error=RoleNotAuthorized";
        }

        console.log("✅ SignIn authorized for:", userEmail);
        return true;
      } catch (error) {
        console.error("❌ SignIn callback error:", error.message);
        return "/sign-in?error=SignInError";
      }
    },

    async jwt({ token, user, account, profile }) {
      try {
        if (user) {
          console.log("=== JWT Callback ===");
          console.log("Creating JWT for user:", user.email);

          // Fetch user details from database
          const result = await query("SELECT * FROM users WHERE email = ?", [
            user.email,
          ]);

          if (result.length > 0) {
            const dbUser = result[0];
            token.userId = dbUser.id;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.roleCode = dbUser.role_code;
            token.role = getRoleName(dbUser.role_code);
            console.log("✅ JWT token created:", {
              userId: token.userId,
              name: token.name,
              email: token.email,
              roleCode: token.roleCode,
            });
          } else {
            console.log("⚠️ User not found in database during JWT creation");
          }
        }
        return token;
      } catch (error) {
        console.error("❌ JWT callback error:", error.message);
        return token;
      }
    },

    async session({ session, token }) {
      console.log("=== Session Callback ===");
      // Pass token info to session
      if (token) {
        session.user.userId = token.userId;
        session.user.name = token.name; // Add this line
        session.user.email = token.email; // Add this line
        session.user.roleCode = token.roleCode;
        session.user.role = token.role;
        console.log("✅ Session created:", {
          userId: session.user.userId,
          name: session.user.name,
          email: session.user.email,
          roleCode: session.user.roleCode,
        });
      }
      return session;
    },

    async redirect({ url, baseUrl, token }) {
      console.log("=== Redirect Callback ===");
      console.log("Redirect URL:", url);
      console.log("Base URL:", baseUrl);

      // Redirect after sign in (url is typically /api/auth/callback/credentials?callbackUrl=...)
      if (token && token.roleCode) {
        if (token.roleCode === 605) {
          return baseUrl + '/parent';
        } else if ([602, 603].includes(token.roleCode)) {
          return baseUrl + '/admin';
        } else {
          return baseUrl; // fallback, home page or sign-in
        }
      }

      // Fallback redirect logic
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;

      return baseUrl + "/admin";
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  secret: process.env.NEXTAUTH_SECRET,
  // debug: false, // Disable debug mode in production
};

function getRoleName(roleCode) {
  const roleMap = {
    601: "User",
    602: "Admin",
    603: "Super Admin",
    604: "Invoice User",
    605:"Parent"
  };
  return roleMap[roleCode] || "Unknown";
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
