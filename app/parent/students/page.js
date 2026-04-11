"use client";
import { useState, useEffect } from "react";
import ParentStudentTable from "@/component/parent/ParentStudentTable";
import { FiPlus } from "react-icons/fi";
import Select from "react-select";

export default function ParentStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newStudent, setNewStudent] = useState({
    student_name: "",
    student_email: "",
    categories: [],
    subjects: [],
    courses: [],
  });

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

  const handleCategoryChange = (selected) => {
    const categoryValues = selected
      ? selected.map((option) => option.value)
      : [];

    let subjects = [];

    const hasGrades = categoryValues.some((c) => c.startsWith("Grade-"));
    const hasAP = categoryValues.includes("AP-Courses");
    const hasCollege = categoryValues.includes("College-Tests");

    if (hasGrades) subjects.push(...gradeSubjects);
    if (hasAP) subjects.push(...apSubjectCategories);
    if (hasCollege) subjects.push(...collegeTests);

    const uniqueSubjects = [...new Set(subjects)];
    setAvailableSubjects(uniqueSubjects);

    setNewStudent((prev) => ({
      ...prev,
      categories: categoryValues,
      subjects: prev.subjects.filter((s) => uniqueSubjects.includes(s)),
      courses: hasAP ? prev.courses : [],
    }));
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (creating) return;

    if (!newStudent.student_name || !newStudent.student_email) {
      alert("Name and Email are required");
      return;
    }

    if (newStudent.categories.length === 0) {
      alert("Please select at least one category");
      return;
    }

    setCreating(true);

    try {
      const payload = {
        // parent_id: 26,  replace with logged-in parent ID
        studentName: newStudent.student_name,
        studentEmail: newStudent.student_email,
        categories: newStudent.categories,
        subjects: newStudent.subjects,
      };

      const res = await fetch("/api/parent/add-student/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Student created successfully!");

        setShowCreateModal(false);

        // reset properly
        setNewStudent({
          student_name: "",
          student_email: "",
          categories: [],
          subjects: [],
          courses: [],
        });

        setAvailableSubjects([]);

        fetchStudents();
      } else {
        const errorData = await res.json();
        console.log("CREATE STUDENT ERROR:", errorData);
        alert(JSON.stringify(errorData, null, 2));
      }
    } catch (err) {
      console.error(err);
      alert("Error creating student");
    } finally {
      setCreating(false);
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setNewStudent({
      student_name: "",
      student_email: "",
      categories: [],
      subjects: [],
      courses: [],
    });
    setAvailableSubjects([]);
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/parent/students/", {
        credentials: "include",
      });

      const data = await res.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>My Students</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus /> Add Student
        </button>
      </div>

      <ParentStudentTable
        registrations={students}
        loading={loading}
        onRefresh={fetchStudents}
      />

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleCreateStudent}>
              <div className="modal-header">
                <h5>Add Student</h5>
              </div>

              <div className="modal-body">
                {/* Student Name */}
                <div className="mb-2">
                  <label className="text-muted">
                    Student Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    className="form-control"
                    value={newStudent.student_name}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
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
                    value={newStudent.student_email}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
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
                    value={newStudent.categories.map((cat) => ({
                      value: cat,
                      label:
                        categoryOptions.find((c) => c.value === cat)?.label ||
                        cat,
                    }))}
                    onChange={handleCategoryChange}
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
                      {newStudent.categories.includes("AP-Courses")
                        ? "For AP Courses: Select subject categories, then choose specific courses later"
                        : "For Grades/College Tests: These are your final selections"}
                    </small>

                    <Select
                      isMulti
                      options={availableSubjects.map((s) => ({
                        value: s,
                        label: s,
                      }))}
                      value={newStudent.subjects.map((s) => ({
                        value: s,
                        label: s,
                      }))}
                      onChange={(selected) =>
                        setNewStudent((prev) => ({
                          ...prev,
                          subjects: selected
                            ? selected.map((opt) => opt.value)
                            : [],
                        }))
                      }
                    />
                  </div>
                )}

                {/* Summary Box */}
                {(newStudent.categories.length > 0 ||
                  newStudent.subjects.length > 0) && (
                  <div className="mt-3">
                    <div className="alert alert-info">
                      <div>
                        <strong>Categories:</strong>{" "}
                        {newStudent.categories.join(", ")}
                      </div>
                      <div>
                        <strong>Subjects:</strong>{" "}
                        {newStudent.subjects.join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={creating}
                >
                  {creating ? "Saving..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
