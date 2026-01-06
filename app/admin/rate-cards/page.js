"use client";
import { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';

export default function RateCardManagement() {
  const [rateCards, setRateCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRateCard, setEditingRateCard] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [updateReason, setUpdateReason] = useState(''); // NEW
  const [updating, setUpdating] = useState(false);

  // Fetch rate cards
  const fetchRateCards = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/admin/rate-cards');
      if (response.ok) {
        const data = await response.json();
        setRateCards(data.rateCards || []);
      } else {
        alert('Failed to fetch rate cards');
      }
    } catch (error) {
      console.error('Error fetching rate cards:', error);
      alert('Error loading rate cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRateCards();
  }, []);

  // Open edit modal
  const handleEdit = (rateCard) => {
    setEditingRateCard(rateCard);
    setNewPrice(rateCard.price_per_session);
    setUpdateReason(''); // Reset reason
    setShowEditModal(true);
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newPrice || newPrice <= 0) {
      alert('Please enter a valid price');
      return;
    }

    // Check if price actually changed
    if (parseFloat(newPrice) === parseFloat(editingRateCard.price_per_session)) {
      alert('Price has not changed');
      return;
    }

    // Validate reason
    if (!updateReason || updateReason.trim() === '') {
      alert('Please provide a reason for this price update');
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch('/api/auth/admin/rate-cards/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rateCardId: editingRateCard.id,
          newPrice: parseFloat(newPrice),
          updateReason: updateReason.trim() // NEW
        })
      });

      if (response.ok) {
        alert('Rate card updated successfully!');
        setShowEditModal(false);
        setEditingRateCard(null);
        setNewPrice('');
        setUpdateReason(''); // Reset
        fetchRateCards();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update rate card');
      }
    } catch (error) {
      console.error('Error updating rate card:', error);
      alert('Error updating rate card');
    } finally {
      setUpdating(false);
    }
  };

  // DataTable columns
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '70px',
    },
    {
      name: 'Subject',
      selector: row => row.subject,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Grade Range',
      selector: row => row.grade_range,
      sortable: true,
      width: '160px',
    },
    {
      name: 'Class Type',
      selector: row => row.class_type,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Price/Session',
      selector: row => `$${parseFloat(row.price_per_session).toFixed(2)}`,
      sortable: true,
      width: '130px',
    },
    {
      name: 'Status',
      cell: row => (
        <span className={`badge ${row.is_active === 0 ? 'bg-success' : 'bg-secondary'}`}>
          {row.is_active === 0 ? 'Active' : 'Inactive'}
        </span>
      ),
      width: '90px',
    },
    {
      name: 'Updated By',
      selector: row => row.updated_by_name || 'N/A',
      sortable: true,
      width: '130px',
    },
    {
      name: 'Reason',
      cell: row => (
        row.update_reason ? (
          <span title={row.update_reason} style={{ cursor: 'pointer' }}>
            {row.update_reason.length > 30 
              ? row.update_reason.substring(0, 30) + '...' 
              : row.update_reason}
          </span>
        ) : 'N/A'
      ),
      width: '200px',
    },
    {
      name: 'Updated At',
      selector: row => new Date(row.updated_at).toLocaleDateString(),
      sortable: true,
      width: '120px',
    },
    {
      name: 'Actions',
      cell: row => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleEdit(row)}
          disabled={row.is_active !== 0}
        >
          <i className="fas fa-edit me-1"></i>
          Edit
        </button>
      ),
      ignoreRowClick: true,
      button: true,
      width: '100px',
    },
  ], []);

  // Filter data
  const filteredItems = rateCards.filter(item => {
    const searchStr = filterText.toLowerCase();
    return (
      item.subject?.toLowerCase().includes(searchStr) ||
      item.grade_range?.toLowerCase().includes(searchStr) ||
      item.class_type?.toLowerCase().includes(searchStr) ||
      item.updated_by_name?.toLowerCase().includes(searchStr)
    );
  });

  const subHeaderComponent = useMemo(() => {
    return (
      <input
        type="text"
        placeholder="Search rate cards..."
        className="form-control"
        style={{ width: '300px' }}
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      />
    );
  }, [filterText]);

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Rate Card Management</h2>
            <button 
              className="btn btn-primary"
              onClick={fetchRateCards}
              disabled={loading}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
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
                noDataComponent="No rate cards found"
                defaultSortFieldId={1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingRateCard && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div className="modal-header" style={{
              padding: '20px',
              borderBottom: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h5 className="mb-0">Edit Rate Card</h5>
              <button 
                onClick={() => setShowEditModal(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body" style={{ padding: '20px' }}>
              <div className="row">
                <div className="col-12 mb-3">
                  <div className="alert alert-info">
                    <strong>Note:</strong> Updating this rate card will create a new active record and disable the current one.
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Subject</strong></label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingRateCard.subject}
                    disabled
                    style={{ backgroundColor: '#e9ecef' }}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Grade Range</strong></label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingRateCard.grade_range}
                    disabled
                    style={{ backgroundColor: '#e9ecef' }}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Class Type</strong></label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingRateCard.class_type}
                    disabled
                    style={{ backgroundColor: '#e9ecef' }}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Current Price</strong></label>
                  <input
                    type="text"
                    className="form-control"
                    value={`$${parseFloat(editingRateCard.price_per_session).toFixed(2)}`}
                    disabled
                    style={{ backgroundColor: '#e9ecef' }}
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">
                    <strong>New Price per Session *</strong>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="Enter new price"
                    />
                  </div>
                </div>

                {/* NEW: Reason Field */}
                <div className="col-12 mb-3">
                  <label className="form-label">
                    <strong>Reason for Update *</strong>
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={updateReason}
                    onChange={(e) => setUpdateReason(e.target.value)}
                    placeholder="Please provide a reason for this price change (e.g., Market adjustment, Competitive pricing, etc.)"
                    maxLength="500"
                  />
                  <small className="text-muted">
                    {updateReason.length}/500 characters
                  </small>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{
              padding: '20px',
              borderTop: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Update Rate Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
