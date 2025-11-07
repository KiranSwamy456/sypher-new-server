"use client";
import { useState, useEffect } from 'react';
import StatsCards from 'component/admin/StatsCards';

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRegistrations: 0,
    adminUsers: 0,
    regularUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Initialize variables
      let totalUsers = 0, adminUsers = 0, regularUsers = 0;
      let totalRegistrations = 0;

      // Fetch users data
      try {
        const usersRes = await fetch('/api/auth/users/');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          console.log('Users API response:', usersData);
          
          if (usersData.success && usersData.users) {
            totalUsers = usersData.users.length;
            adminUsers = usersData.users.filter(u => [602, 603].includes(u.role_code)).length;
            regularUsers = usersData.users.filter(u => u.role_code === 601).length;
          }
        } else {
          console.error('Users API error:', usersRes.status);
        }
      } catch (usersError) {
        console.error('Error fetching users:', usersError);
      }

      // Fetch registrations data
      try {
        const registrationsRes = await fetch('/api/auth/registrations/');
        if (registrationsRes.ok) {
          const registrationsData = await registrationsRes.json();
          console.log('Registrations API response:', registrationsData);
          
          if (registrationsData.success && registrationsData.registrations) {
            totalRegistrations = registrationsData.registrations.length;
          }
        } else {
          console.log('Registrations API not available or error:', registrationsRes.status);
          // Don't treat this as an error since registrations API might not exist yet
        }
      } catch (registrationsError) {
        console.log('Registrations API not available:', registrationsError.message);
        // Don't treat this as an error since registrations API might not exist yet
      }

      // Update stats
      setStats({
        totalUsers,
        totalRegistrations,
        adminUsers,
        regularUsers
      });

      console.log('Final stats:', {
        totalUsers,
        totalRegistrations,
        adminUsers,
        regularUsers
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="page-header">
          <h1>Dashboard</h1>
          <div className="alert alert-danger">
            {error}
            <button 
              className="btn btn-primary ml-2" 
              onClick={fetchStats}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome to Sypher Admin Panel</p>
      </div>
      
      <StatsCards stats={stats} />
    </div>
  );
}
