"use client";
import { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';

const UserTable = ({ users = [], roles, loading, onRefresh }) => {
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [filterText, setFilterText] = useState('');

  const getRoleName = (roleCode) => {
    const roleMap = {
      601: 'User',
      602: 'Admin', 
      603: 'Super Admin',
      604: 'Invoice User'
    };
    return roleMap[roleCode] || 'Unknown';
  };

  const handleEditUser = async (userId) => {
    try {
      const response = await fetch(`/api/auth/users/${userId}/`);
      if (response.ok) {
        const data = await response.json();
        setEditingUser(data.user);
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setUpdatingUser(true);

    try {
      const response = await fetch(`/api/auth/users/${editingUser.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });

      if (response.ok) {
        onRefresh();
        setShowEditModal(false);
        setEditingUser(null);
        alert('User updated successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update user');
      }
    } catch (error) {
      alert('Error updating user');
      console.error('Update user error:', error);
    } finally {
      setUpdatingUser(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to deactivate user "${userName}"?`)) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const response = await fetch(`/api/auth/users/${userId}/`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onRefresh();
        alert('User deactivated successfully!');
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      alert('Error deleting user');
      console.error('Delete user error:', error);
    } finally {
      setDeletingUserId(null);
    }
  };

  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => row.role_code,
      sortable: true,
      cell: row => (
        <span className={`badge ${row.role_code >= 602 ? 'badge-warning' : 'badge-info'}`}>
          {getRoleName(row.role_code)}
        </span>
      ),
    },
    {
      name: 'Mobile',
      selector: row => row.mobile_number || 'N/A',
      sortable: true,
    },
    {
      name: 'City',
      selector: row => row.city || 'N/A',
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => row.created_at,
      sortable: true,
      format: row => new Date(row.created_at).toLocaleDateString(),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-outline-primary tooltip-btn"
            title="Edit User"
            onClick={() => handleEditUser(row.id)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger tooltip-btn"
            title="Deactivate User"
            onClick={() => handleDeleteUser(row.id, row.name)}
            disabled={deletingUserId === row.id}
          >
            {deletingUserId === row.id ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-times"></i>
            )}
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
    },
  ], [deletingUserId]);

  // Filter data
  const filteredItems = users.filter(
    item => {
      const searchStr = filterText.toLowerCase();
      return (
        item.name?.toLowerCase().includes(searchStr) ||
        item.email?.toLowerCase().includes(searchStr) ||
        item.city?.toLowerCase().includes(searchStr) ||
        item.mobile_number?.toLowerCase().includes(searchStr)
      );
    }
  );

  // Search component
  const subHeaderComponent = useMemo(() => {
    return (
      <input
        type="text"
        placeholder="Search users..."
        className="form-control"
        style={{ width: '300px' }}
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      />
    );
  }, [filterText]);

  return (
    <>
      <div className="data-table">
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          paginationPerPage={25}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          progressPending={loading}
          highlightOnHover
          pointerOnHover
          striped
          subHeader
          subHeaderComponent={subHeaderComponent}
          noDataComponent="No users found"
          defaultSortFieldId={1}
        />
      </div>

      {/* Edit Modal - same as before */}
      {showEditModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Edit User</h5>
              <button onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    className="form-control"
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="form-control"
                    value={editingUser.role_code || editingUser.roleCode || 601}
                    onChange={(e) => setEditingUser({
                      ...editingUser, 
                      roleCode: parseInt(e.target.value), 
                      role_code: parseInt(e.target.value)
                    })}
                  >
                    {roles && roles.length > 0 ? roles.map(role => (
                      <option key={role.role_code} value={role.role_code}>
                        {role.role_name}
                      </option>
                    )) : (
                      <option value={601}>User</option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={editingUser.mobile_number || ''}
                    onChange={(e) => setEditingUser({...editingUser, mobile_number: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingUser.city || ''}
                    onChange={(e) => setEditingUser({...editingUser, city: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingUser.pincode || ''}
                    onChange={(e) => setEditingUser({...editingUser, pincode: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={updatingUser}>
                  {updatingUser ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserTable;
