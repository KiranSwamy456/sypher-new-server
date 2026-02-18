// "use client";
// import React from "react";
// import LoginForm from "../form/LoginForm";
// import GoogleLoginButton from "./GoogleLoginButton";

// const LoginSection = () => {
//   return (
//     <section
//       className="tf__login d-flex align-items-center justify-content-center"
//       style={{ minHeight: "100vh" }}
//     >
//       <div className="container">
//         <div className="row justify-content-center">
//           <div className="col-xxl-5 col-xl-6 col-md-9 col-lg-7">
//             <div className="tf__login_area">
//               <h2>Welcome to Sypher!</h2>
//               <p>Sign in to continue</p>

//               <LoginForm />

//               <div className="text-center my-4">
//                 <span className="text-muted">or</span>
//               </div>

//               <div className="text-center">
//                 <GoogleLoginButton />
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LoginSection;


"use client";

import React, { useEffect } from "react";
import LoginForm from "../form/LoginForm";
import GoogleLoginButton from "./GoogleLoginButton";

const LoginSection = () => {

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <div className="container-fluid p-0 login-wrapper">
      <div className="row g-0 min-vh-100">

        {/* LEFT SIDE - SLIDER */}
        <div className="col-lg-6 d-none d-lg-flex login-left">

          <div
            id="loginCarousel"
            className="carousel slide carousel-fade w-100"
            data-bs-ride="carousel"
            data-bs-interval="3000"
          >
            <div className="carousel-inner text-white text-center">

              <div className="carousel-item active">
                <div className="slider-content">
                  <h2>The Architectural Breakthrough</h2>
                  <p>Multi-layer intelligent redaction system built for enterprise security.</p>
                </div>
              </div>

              <div className="carousel-item">
                <div className="slider-content">
                  <h2>Role Based Access Control</h2>
                  <p>Secure data visibility based on user permissions.</p>
                </div>
              </div>

              <div className="carousel-item">
                <div className="slider-content">
                  <h2>Compliance Ready</h2>
                  <p>Built for enterprise-level compliance standards.</p>
                </div>
              </div>

            </div>

            <div className="carousel-indicators">
              <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="0" className="active"></button>
              <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="1"></button>
              <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="2"></button>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center login-right">

          <div className="login-box">
            <h3>Welcome to Sypher!</h3>
            <p className="text-muted mb-4">Sign in to continue</p>

            <LoginForm />

            <div className="text-center my-3 text-muted">or</div>

            <GoogleLoginButton />
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginSection;