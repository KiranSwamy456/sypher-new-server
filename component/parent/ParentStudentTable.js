"use client";
import { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

const ParentStudentTable = ({ registrations = [], loading, onRefresh }) => {
  const [search, setSearch] = useState("");

  // ✅ Pagination state (MUI style)
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    id: null,
    name: "",
  });

  // 🔍 Filter
  const filtered = (registrations || []).filter((s) =>
    (s?.student_name || "").toLowerCase().includes(search.toLowerCase()),
  );

  // ✅ Pagination logic
  const total = filtered.length;
  const totalPages = Math.ceil(total / rowsPerPage);

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const paginatedData = filtered.slice(startIndex, endIndex);

  // 🔍 Search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  // 🔁 Pagination handlers
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(0);
  };

  const goFirst = () => setCurrentPage(0);
  const goLast = () => setCurrentPage(totalPages - 1);
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 0));

  return (
    <div className="card">
      <div className="card-body">
        {/* 🔍 Search */}
        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            placeholder="Search students..."
            className="form-control"
            style={{ maxWidth: 300 }}
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* 📊 Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Category</th>
                    <th>Subjects</th>
                    <th style={{ width: 120 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((s, index) => (
                      <tr key={s.id}>
                        {/* ✅ Serial across pages */}
                        <td>{startIndex + index + 1}</td>

                        <td>{s.student_name}</td>
                        <td>{s.student_email}</td>

                        <td>
                          {s.category?.split(",").map((c, i) => (
                            <span key={i} className="badge bg-info me-1">
                              {c.trim()}
                            </span>
                          ))}
                        </td>

                        <td>
                          {s.subjects?.split(",").map((sub, i) => (
                            <span key={i} className="badge bg-primary me-1">
                              {sub.trim()}
                            </span>
                          ))}
                        </td>

                        <td>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => setEditingStudent(s)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            disabled={deletingId === s.id}
                          >
                            {deletingId === s.id ? (
                              "..."
                            ) : (
                              <i className="fas fa-trash"></i>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ MUI-style Pagination */}
            {total > 0 && (
              <div className="d-flex justify-content-end align-items-center mt-3 gap-3 flex-wrap">
                {/* Rows per page */}
                <div className="d-flex align-items-center gap-2">
                  <span>Rows per page:</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 80 }}
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                  >
                    {[5, 10, 25].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Range */}
                <div>
                  {`${startIndex + 1}-${Math.min(endIndex, total)} of ${total}`}
                </div>

                {/* Controls */}
                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-light"
                    onClick={goFirst}
                    disabled={currentPage === 0}
                  >
                    ⏮
                  </button>

                  <button
                    className="btn btn-sm btn-light"
                    onClick={goPrev}
                    disabled={currentPage === 0}
                  >
                    ◀
                  </button>

                  <button
                    className="btn btn-sm btn-light"
                    onClick={goNext}
                    disabled={currentPage >= totalPages - 1}
                  >
                    ▶
                  </button>

                  <button
                    className="btn btn-sm btn-light"
                    onClick={goLast}
                    disabled={currentPage >= totalPages - 1}
                  >
                    ⏭
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ParentStudentTable;
