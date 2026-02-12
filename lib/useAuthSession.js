import { useSession } from "next-auth/react";

export function useAuthSession() {
  const { data: session, status } = useSession();

  return {
    session,
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    roleCode: session?.user?.roleCode,
    isAdmin: [602, 603].includes(session?.user?.roleCode),
  };
}
