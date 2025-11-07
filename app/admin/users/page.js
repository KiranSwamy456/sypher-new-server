"use client";
import { useState, useEffect } from 'react';
import UserTable from '@/component/admin/UserTable';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    roleCode: 601,
    mobileNumber: '',
    city: '',
    pincode: ''
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/users/'); // Add trailing slash
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []); // Add fallback
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/auth/roles/'); // Add trailing slash
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []); // Add fallback
      } else {
        console.log('Roles API failed, using fallback roles');
        setFallbackRoles();
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setFallbackRoles();
    }
  };

  const setFallbackRoles = () => {
    setRoles([
      { role_code: 601, role_name: 'User' },
      { role_code: 602, role_name: 'Admin' },
      { role_code: 603, role_name: 'Super Admin' },
      { role_code: 604, role_name: 'Invoice User' }
    ]);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/create-user/', { // Add trailing slash
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        fetchUsers();
        setShowCreateModal(false);
        setNewUser({
          name: '', email: '', password: '', roleCode: 601,
          mobileNumber: '', city: '', pincode: ''
        });
        alert('User created successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };

  const refreshData = () => {
    fetchUsers();
    fetchRoles();
  };

  useEffect(() => {
    // Initialize fallback roles immediately
    setFallbackRoles();
    
    Promise.all([fetchUsers(), fetchRoles()]).then(() => setLoading(false));
  }, []);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Users Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus"></i> Create User
        </button>
      </div>

      <UserTable 
        users={users} 
        roles={roles}
        loading={loading} 
        onRefresh={refreshData}
      />

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Create New User</h5>
              <button onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    className="form-control"
                    value={newUser.roleCode}
                    onChange={(e) => setNewUser({...newUser, roleCode: parseInt(e.target.value)})}
                    required
                  >
                    <option value="">Select Role</option>
                    {Array.isArray(roles) && roles.map(role => (
                      <option key={role.role_code} value={role.role_code}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={newUser.mobileNumber}
                    onChange={(e) => setNewUser({...newUser, mobileNumber: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.city}
                    onChange={(e) => setNewUser({...newUser, city: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.pincode}
                    onChange={(e) => setNewUser({...newUser, pincode: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
