"use client";
import React from "react";
import LoginForm from "../form/LoginForm";
import GoogleLoginButton from "./GoogleLoginButton";
import Link from "next/link";

const LoginSection = () => {
  return (
    <section className="tf__login mt_195 xs_mt_95">
      <div className="container">
        <div className="row wow fadeInUp">
          <div className="col-xxl-5 col-xl-6 col-md-9 col-lg-7 m-auto">
            <div className="tf__login_area">
              <h2>Welcome to Sypher!</h2>
              <p>sign in to continue</p>
              
              <div className="mb-3">
                <GoogleLoginButton />
              </div>
              
              <div className="text-center my-3">
                <span className="text-muted">or</span>
              </div>
              
              <LoginForm />
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
