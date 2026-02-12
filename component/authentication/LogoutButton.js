"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/sign-in",
    });
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      <i className="fas fa-sign-out-alt me-2" />
      Logout
    </button>
  );
}
