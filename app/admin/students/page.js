"use client";
import { useState, useEffect } from "react";
import StudentTable from "@/component/admin/StudentTable";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/auth/students/");
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.students || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/auth/users/");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const refreshData = () => {
    fetchRegistrations();
    fetchUsers();
  };

  useEffect(() => {
    Promise.all([fetchRegistrations(), fetchUsers()]).then(() =>
      setLoading(false)
    );
  }, []);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Students Management</h1>
      </div>

      <StudentTable
        registrations={registrations}
        users={users}
        loading={loading}
        onRefresh={refreshData}
      />
    </div>
  );
}
