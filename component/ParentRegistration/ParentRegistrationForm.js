"use client";
import ParentRegisterForm from "../form/ParentRegisterForm";


export default function LoginSection() {
  return (
    <div className="container-fluid p-0">
      <div className="row g-0 vh-100">

        {/* LEFT SIDE */}
        <div className="col-lg-6 d-none d-lg-flex left-panel">
          <div className="left-overlay"></div>

          <div className="left-content text-white">
            <h2 className="logo">Sypher Academy</h2>

            <div className="welcome-box">
              <h1 style={{ color:"#fff"}}>Welcome to Sypher Academy!</h1>
              <p>
                Our scientifically-backed, personalized learning pathways are designed to help every student reach their full potential. All at an affordable cost for parents.
              </p>
            </div>

            <p className="copyright">
              Copyright 2026 Sypher Academy. All rights reserved.
            </p>
          </div>
        </div>

      
        <div className="col-lg-6 right-panel d-flex align-items-center justify-content-center ">
          <div className="register-wrapper">

            {/* Signup text 
            <div className="small mb-4 bold">
              Need an account? <a href="#">Signup here</a>
            </div> */}

            {/* Title */}
            <h2 className="register-title mb-4" >Parent Registration</h2>

            {/* Login Form */}
            <ParentRegisterForm/>            

          </div>
        </div>

      </div>
    </div>
  );
}
