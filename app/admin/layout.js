"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/component/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminLayoutWrapper({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

useEffect(() => {
  if (!loading && (!user || ![602, 603].includes(user.roleCode))) {
    router.push('/sign-in');
  }
}, [user, loading, router]);

  if (loading) {
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

  if (!user || user.roleCode !== 602) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}