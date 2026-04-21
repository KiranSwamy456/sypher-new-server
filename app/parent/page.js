"use client";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import StatsCards from 'component/parent/StatsCards';

export default function ParentHome() {

  const { data: session } = useSession();

  const [stats, setStats] = useState({
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');

      let totalStudents = 0;

      const parentId = session?.user?.id;
      console.log("Dashboard user:", session?.user);

      const res = await fetch(`/api/parent/students/count?parent_id=${parentId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await res.json();

      if (data.totalStudents !== undefined) {
        totalStudents = data.totalStudents;
      }

      setStats({
        totalStudents
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchStats();
    }
  }, [session]);

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
          <h1>Parent Dashboard</h1>
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
        <p>Welcome to Sypher Parent Panel</p>
      </div>
      
      <StatsCards stats={stats} />
    </div>
  );
}