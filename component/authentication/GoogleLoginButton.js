// "use client";

// import { signIn } from "next-auth/react";
// import { useState } from "react";

// export default function GoogleLoginButton() {
//   const [loading, setLoading] = useState(false);

//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     await signIn("google", {
//       redirect: true,
//       callbackUrl: "/admin",
//     });
//     setLoading(false);
//   };

//   return (
//     <button
//       onClick={handleGoogleSignIn}
//       disabled={loading}
//       className="google-icon-btn"
//     >
//       {loading ? (
//         <div className="spinner"></div>
//       ) : (
//         <svg
//           width="22"
//           height="22"
//           viewBox="0 0 48 48"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fill="#EA4335"
//             d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.4 0 24 0 14.82 0 6.73 5.4 2.69 13.32l7.98 6.2C12.65 13.18 17.86 9.5 24 9.5z"
//           />
//           <path
//             fill="#4285F4"
//             d="M46.1 24.5c0-1.63-.15-3.2-.43-4.7H24v9h12.45c-.54 2.9-2.18 5.36-4.65 7.02l7.19 5.6c4.2-3.87 6.61-9.58 6.61-16.92z"
//           />
//           <path
//             fill="#FBBC05"
//             d="M10.67 28.52a14.5 14.5 0 010-9.04l-7.98-6.2A24 24 0 000 24c0 3.84.92 7.48 2.69 10.72l7.98-6.2z"
//           />
//           <path
//             fill="#34A853"
//             d="M24 48c6.4 0 11.9-2.12 15.87-5.77l-7.19-5.6c-2 1.35-4.55 2.15-8.68 2.15-6.14 0-11.35-3.68-13.33-9.02l-7.98 6.2C6.73 42.6 14.82 48 24 48z"
//           />
//         </svg>
//       )}
//     </button>
//   );
// }


"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", {
      callbackUrl: "/admin",
    });
    setLoading(false);
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="btn google-btn d-flex align-items-center justify-content-center"
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm"></span>
      ) : (
        <>
          {/* Google SVG Icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
            className="me-2"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.4 0 24 0 14.82 0 6.73 5.4 2.69 13.32l7.98 6.2C12.65 13.18 17.86 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.1 24.5c0-1.63-.15-3.2-.43-4.7H24v9h12.45c-.54 2.9-2.18 5.36-4.65 7.02l7.19 5.6c4.2-3.87 6.61-9.58 6.61-16.92z" />
            <path fill="#FBBC05" d="M10.67 28.52a14.5 14.5 0 010-9.04l-7.98-6.2A24 24 0 000 24c0 3.84.92 7.48 2.69 10.72l7.98-6.2z" />
            <path fill="#34A853" d="M24 48c6.4 0 11.9-2.12 15.87-5.77l-7.19-5.6c-2 1.35-4.55 2.15-8.68 2.15-6.14 0-11.35-3.68-13.33-9.02l-7.98 6.2C6.73 42.6 14.82 48 24 48z" />
          </svg>

          Google
        </>
      )}
    </button>
  );
}
