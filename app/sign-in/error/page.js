"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    let message = "";
    
    switch (error) {
      case "EmailNotValidated":
        message = "Email not validated. Please register first or contact support.";
        break;
      case "AccountInactive":
        message = "Your account is inactive. Please contact support.";
        break;
      case "RoleNotAuthorized":
        message = "Your account does not have access to the admin panel.";
        break;
      case "SignInError":
        message = "An error occurred during sign in. Please try again.";
        break;
      case "OAuthSignin":
        message = "Error connecting to Google. Please try again.";
        break;
      case "OAuthCallback":
        message = "Error with Google callback. Please try again.";
        break;
      case "Callback":
        message = "An unexpected error occurred. Please try again.";
        break;
      default:
        message = "An error occurred. Please try again.";
    }
    
    setErrorMessage(message);
    
    // Show browser alert
    if (message) {
      alert(`❌ Authentication Failed\n\n${message}`);
    }
  }, [error]);

  return (
    <section className="tf__login mt_195 xs_mt_95">
      <div className="container">
        <div className="row wow fadeInUp">
          <div className="col-xxl-5 col-xl-6 col-md-9 col-lg-7 m-auto">
            <div className="tf__login_area">
              <h2>Sign In Error</h2>

              {showAlert && errorMessage && (
                <div className="alert alert-danger mt-4 alert-dismissible fade show" role="alert">
                  <i className="fas fa-exclamation-circle me-2" />
                  <strong>Authentication Failed</strong>
                  <p className="mt-2 mb-0">{errorMessage}</p>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAlert(false)}
                  ></button>
                </div>
              )}

              {error === "EmailNotValidated" && (
                <div className="mt-4 p-3 bg-light rounded">
                  <p className="mb-2">
                    <strong>Don't have an account?</strong>
                  </p>
                  <p className="text-muted small">
                    Please contact your administrator to register your email address in the system.
                  </p>
                </div>
              )}

              <div className="d-flex gap-2 mt-4">
                <Link href="/sign-in" className="btn btn-primary flex-grow-1">
                  <i className="fas fa-arrow-left me-2" />
                  Back to Login
                </Link>
                <a
                  href="mailto:support@sypher.com"
                  className="btn btn-outline-secondary flex-grow-1"
                >
                  <i className="fas fa-envelope me-2" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
