"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ParentLayout from '@/component/parent/ParentLayout';
import '@/styles/admin.css';


export default function ParentLayoutWrapper({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to sign-in
    if (status === "unauthenticated") {
      router.push('/sign-in');
    }
    
    // If authenticated, check role
    if (status === "authenticated") {
      const allowedRoles = [605]; // Parent 
      if (!allowedRoles.includes(session?.user?.roleCode)) {
        router.push('/sign-in');
      }
    }
  }, [status, session, router]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="loading-spinner" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  // Authenticated but wrong role
  if (![605].includes(session?.user?.roleCode)) {
    return null;
  }

  return <ParentLayout>{children}</ParentLayout>;
}