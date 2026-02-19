"use client";
import React from "react";
import LoginForm from "../form/LoginForm";
import GoogleLoginButton from "./GoogleLoginButton";

const LoginSection = () => {
  return (
    <section
      className="tf__login d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-5 col-xl-6 col-md-9 col-lg-7">
            <div className="tf__login_area">
              <h2>Welcome to Sypher!</h2>
              <p>Sign in to continue</p>

              <LoginForm />

              <div className="text-center my-4">
                <span className="text-muted">or</span>
              </div>

              <div className="text-center">
                <GoogleLoginButton />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;


