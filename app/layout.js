// app/layout.js
import { EduorProvider } from "@/context/EduorContext";
import { AuthProvider } from "@/context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/public/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import "@/public/css/style.css";
import { ToastContainer } from "react-toastify";
import StickySocialMedia from "@/component/utils/StickySocialMedia";

// Add this metadata export
export const metadata = {
  verification: {
    google: 'krgQUFQr7GitBtVgP5r6lxwX87d7Y83yfykLTGlf30c',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <EduorProvider>
        <AuthProvider>
          <body>
            {children}
            <StickySocialMedia />
            <ToastContainer />
          </body>
        </AuthProvider>
      </EduorProvider>
    </html>
  );
}