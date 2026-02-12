"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn("google", {
        redirect: true, // Let NextAuth handle the redirect
        callbackUrl: "/admin",
      });

      if (result?.error) {
        // Handle different error types
        const errorMap = {
          EmailNotValidated: "Email not validated. Please register first.",
          AccountInactive: "Your account is inactive. Please contact support.",
          RoleNotAuthorized: "You don't have admin access.",
          SignInError: "An error occurred during sign in.",
          OAuthSignin: "Error connecting to Google. Please try again.",
          OAuthCallback: "Error with Google callback. Please try again.",
          Callback: "An unexpected error occurred.",
        };

        const errorMessage = errorMap[result.error] || result.error;
        setError(errorMessage);

        // Show alert
        alert(`❌ Authentication Failed\n\n${errorMessage}`);
      }
    } catch (err) {
      const errorMsg = "An error occurred during sign in";
      setError(errorMsg);
      alert(`❌ ${errorMsg}`);
      console.error("Google sign in error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-login-container">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2" />
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="btn btn-outline-danger w-100"
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            Signing in...
          </>
        ) : (
          <>
            <i className="fab fa-google me-2" />
            Sign in with Google
          </>
        )}
      </button>
    </div>
  );
}
