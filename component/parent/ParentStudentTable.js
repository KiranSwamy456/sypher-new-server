"use client";
import { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

const ParentStudentTable = ({ registrations = [], loading, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const categoryOptions = [
    { value: "Grade-1", label: "Grade 1" },
    { value: "Grade-2", label: "Grade 2" },
    { value: "Grade-3", label: "Grade 3" },
    { value: "Grade-4", label: "Grade 4" },
    { value: "Grade-5", label: "Grade 5" },
    { value: "Grade-6", label: "Grade 6" },
    { value: "Grade-7", label: "Grade 7" },
    { value: "Grade-8", label: "Grade 8" },
    { value: "Grade-9", label: "Grade 9" },
    { value: "Grade-10", label: "Grade 10" },
    { value: "Grade-11", label: "Grade 11" },
    { value: "Grade-12", label: "Grade 12" },
    { value: "AP-Courses", label: "AP Courses" },
    { value: "College-Tests", label: "College Tests" },
  ];

  const gradeSubjects = [
    "English Language Arts",
    "Mathematics",
    "Science",
    "Social Studies",
    "Arts Education",
    "Physical Education/Health",
  ];

  const apSubjectCategories = [
    "English Language Arts",
    "Mathematics",
    "Science",
    "GENERAL SUBJECTS",
    "COMPUTER SCIENCE",
  ];

  const collegeTests = [
    "SAT (Math + English)",
    "SAT Math",
    "SAT English",
    "PSAT",
    "ACT",
  ];
  // 🔍 Filter
  const filtered = (registrations || []).filter((s) =>
    (s?.student_name || "").toLowerCase().includes(search.toLowerCase()),
  );
  const handleEditCategoryChange = (selected) => {
    const categoryValues = selected ? selected.map((opt) => opt.value) : [];

    let subjects = [];

    const hasGrades = categoryValues.some((c) => c.startsWith("Grade-"));
    const hasAP = categoryValues.includes("AP-Courses");
    const hasCollege = categoryValues.includes("College-Tests");

    if (hasGrades) subjects.push(...gradeSubjects);
    if (hasAP) subjects.push(...apSubjectCategories);
    if (hasCollege) subjects.push(...collegeTests);

    const uniqueSubjects = [...new Set(subjects)];
    setAvailableSubjects(uniqueSubjects);

    setFormData((prev) => ({
      ...prev,
      categories: categoryValues,
      subjects: prev.subjects?.filter((s) => uniqueSubjects.includes(s)) || [],
    }));
  };
  // ✏️ Open edit modal
  const handleEdit = (student) => {
    const categories = student.category
      ? student.category.split(",").map((c) => c.trim())
      : [];

    const subjects = student.subjects
      ? student.subjects.split(",").map((s) => s.trim())
      : [];

    setEditingStudent(student);

    setFormData({
      student_name: student.student_name || "",
      student_email: student.student_email || "",
      categories,
      subjects,
    });

    // trigger subject generation
    handleEditCategoryChange(categories.map((c) => ({ value: c, label: c })));
  };

  // 💾 Update student
  const handleUpdate = async () => {
    if (!formData.student_name || !formData.student_email) {
      toast.error("Name and Email are required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        student_name: formData.student_name,
        student_email: formData.student_email,
        category: (formData.categories || []).join(","),
        subjects: (formData.subjects || []).join(","),
      };

      const res = await fetch(`/api/parent/students/${editingStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Student updated successfully");
        setEditingStudent(null);
        onRefresh();
      } else {
        const err = await res.json();
        console.log("UPDATE ERROR:", err);

        toast.error(err?.message || err?.error || "Failed to update student");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating student");
    } finally {
      setSaving(false);
    }
  };

  // ❌ Delete (soft delete)
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    id: null,
    name: "",
  });
  const handleDeleteClick = (id, name) => {
    setDeleteModal({
      show: true,
      id,
      name,
    });
  };
  const confirmDelete = async () => {
    const { id } = deleteModal;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/parent/students/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteModal({ show: false, id: null, name: "" });
        onRefresh();
      } else {
        console.log(await res.json());
        // later replace with toast.error
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };
  const cancelDelete = () => {
    setDeleteModal({ show: false, id: null, name: "" });
  };

  return (
    <div className="card">
      <div className="card-body">
        {/* 🔍 Search */}
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            placeholder="Search students..."
            className="form-control"
            style={{ maxWidth: 300 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 📊 Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, index) => (
                    <tr key={s.id}>
                      <td>{index + 1}</td>
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
                          onClick={() => handleEdit(s)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDeleteClick(s.id, s.student_name)
                          }
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
        )}
      </div>
      {/* Edit Modal */}
      {editingStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              {/* HEADER */}
              <div className="modal-header">
                <h5>Edit Student</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingStudent(null)}
                >
                  &times;
                </button>
              </div>

              {/* BODY */}
              <div className="modal-body">
                {/* Student Name */}
                <div className="mb-2">
                  <label className="text-muted">
                    Student Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    className="form-control"
                    value={formData.student_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        student_name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Student Email */}
                <div className="mb-2">
                  <label className="text-muted">
                    Student Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.student_email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        student_email: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Step 1 */}
                <div className="mt-3">
                  <label>
                    <strong>
                      Step 1: Select Categories{" "}
                      <span style={{ color: "red" }}>*</span>
                    </strong>
                  </label>
                  <br />
                  <small className="text-muted">
                    Choose Grades, AP Courses, or College Tests
                  </small>

                  <Select
                    isMulti
                    options={categoryOptions}
                    value={formData.categories?.map((cat) => ({
                      value: cat,
                      label:
                        categoryOptions.find((c) => c.value === cat)?.label ||
                        cat,
                    }))}
                    onChange={handleEditCategoryChange}
                  />
                </div>

                {/* Step 2 */}
                {availableSubjects.length > 0 && (
                  <div className="mt-3">
                    <label>
                      <strong>
                        Step 2: Select Subjects{" "}
                        <span style={{ color: "red" }}>*</span>
                      </strong>
                    </label>
                    <br />
                    <small className="text-muted">
                      {formData.categories?.includes("AP-Courses")
                        ? "For AP Courses: Select subject categories, then choose specific courses later"
                        : "For Grades/College Tests: These are your final selections"}
                    </small>

                    <Select
                      isMulti
                      options={availableSubjects.map((s) => ({
                        value: s,
                        label: s,
                      }))}
                      value={formData.subjects?.map((s) => ({
                        value: s,
                        label: s,
                      }))}
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          subjects: selected
                            ? selected.map((opt) => opt.value)
                            : [],
                        }))
                      }
                    />
                  </div>
                )}

                {/* Summary */}
                {(formData.categories?.length > 0 ||
                  formData.subjects?.length > 0) && (
                  <div className="mt-3">
                    <div className="alert alert-info">
                      <div>
                        <strong>Categories:</strong>{" "}
                        {formData.categories?.join(", ")}
                      </div>
                      <div>
                        <strong>Subjects:</strong>{" "}
                        {formData.subjects?.join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingStudent(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{ maxWidth: "400px", position: "relative" }}
          >
            {/* ❌ Close Button (Top Right) */}
            <button
              type="button"
              onClick={cancelDelete}
              style={{
                position: "absolute",
                top: "10px",
                right: "12px",
                border: "none",
                background: "transparent",
                fontSize: "22px",
                cursor: "pointer",
                lineHeight: "1",
              }}
            >
              ×
            </button>

            <div className="modal-header">
              <h5>Confirm Delete</h5>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>{deleteModal.name}</strong>?
              </p>

              <p className="text-danger" style={{ fontSize: "13px" }}>
                This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={cancelDelete}>
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={deletingId === deleteModal.id}
              >
                {deletingId === deleteModal.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentStudentTable;
