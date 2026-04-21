"use client";
import { useState, useRef } from "react";
import Select from "react-select";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
export default function ParentRegistrationPage() {
  const studentSectionRef = useRef(null);

  const [parentData, setParentData] = useState({
    parentName: "",
    parentEmail: "",
    password: "",
    phone: "",
    livesIn: "",
    pincode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [students, setStudents] = useState([]);
  const [showStudentForm, setShowStudentForm] = useState(false);

  const [studentForm, setStudentForm] = useState({
    studentName: "",
    studentEmail: "",
    studentGrade: "",
    phone: "",
    categories: [],
    subjects: [],
    courses: [],
  });

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

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

    setStudentForm((prev) => ({
      ...prev,
      categories: categoryValues,
      subjects: prev.subjects.filter((s) => uniqueSubjects.includes(s)),
      courses: hasAP ? prev.courses : [],
    }));

    if (!hasAP) setAvailableCourses([]);
  };

  const handleSubjectChange = (selected) => {
    const subjectValues = selected
      ? selected.map((option) => option.value)
      : [];

    setStudentForm((prev) => ({
      ...prev,
      subjects: subjectValues,
    }));

    const hasAP = studentForm.categories.includes("AP-Courses");

    if (!hasAP) {
      setAvailableCourses([]);
      setStudentForm((prev) => ({ ...prev, courses: [] }));
    }
  };

  const handleAddStudent = () => {
    if (!studentForm.studentName || !studentForm.studentEmail) {
      toast.error("Please fill required fields");
      return;
    }

    if (studentForm.categories.length === 0) {
      toast.warn("Please select at least one category");
      return;
    }

    setStudents((prev) => [...prev, studentForm]);

    setStudentForm({
      studentName: "",
      studentEmail: "",
      studentGrade: "",
      phone: "",
      categories: [],
      subjects: [],
      courses: [],
    });

    setAvailableSubjects([]);
    setAvailableCourses([]);
    setShowStudentForm(false);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const confirmRemoveStudent = (index) => {
    setStudentToDelete({
      index,
      name: students[index].studentName,
    });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete !== null) {
      removeStudent(studentToDelete.index);
    }
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const removeStudent = (index) => {
    const updated = [...students];
    updated.splice(index, 1);
    setStudents(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (students.length === 0) {
      toast.error("Please add at least one student");
      return;
    }
    if (!isValidPhoneNumber(parentData.phone || "")) {
      toast.error("Invalid phone number");
      return;
    }
    const toastId = toast.loading("Submitting registration...");

    try {
      const payload = {
        parentName: parentData.parentName,
        parentEmail: parentData.parentEmail,
        password: parentData.password,
        phone: parentData.phone,
        livesIn: parentData.livesIn,
        pincode: parentData.pincode,
        students: students,
      };

      const response = await fetch("/api/parent/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.update(toastId, {
        render: "Registration submitted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // reset + redirect
      setParentData({
        parentName: "",
        parentEmail: "",
        password: "",
        phone: "",
        livesIn: "",
        pincode: "",
      });

      setStudents([]);

      window.location.href = "/sign-in";
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>
                Parent Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                required
                value={parentData.parentName}
                onChange={(e) =>
                  setParentData({
                    ...parentData,
                    parentName: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Parent Email <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                className="form-control"
                required
                value={parentData.parentEmail}
                onChange={(e) =>
                  setParentData({
                    ...parentData,
                    parentEmail: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  required
                  value={parentData.password}
                  onChange={(e) =>
                    setParentData({
                      ...parentData,
                      password: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Phone Number <span style={{ color: "red" }}>*</span>
              </label>
              <PhoneInput
                international
                defaultCountry="IN" // change if needed
                value={parentData.phone}
                onChange={(value) =>
                  setParentData({
                    ...parentData,
                    phone: value,
                  })
                }
                className=""
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Lives In</label>
              <input
                type="text"
                className="form-control"
                value={parentData.livesIn}
                onChange={(e) =>
                  setParentData({ ...parentData, livesIn: e.target.value })
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Pincode</label>
              <input
                type="text"
                className="form-control"
                value={parentData.pincode}
                maxLength={9}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                  setParentData({ ...parentData, pincode: value });
                }}
              />
            </div>
          </div>
          <div className="">
            {!showStudentForm && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  setShowStudentForm(true);
                  setTimeout(() => {
                    studentSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }, 100);
                }}
              >
                + Add Student
              </button>
            )}
          </div>
          {showStudentForm && (
            <div ref={studentSectionRef} className="card p-3 bg-light">
              <h5 className="mb-2">Student Details</h5>

              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="text-muted">
                    Student Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={studentForm.studentName}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        studentName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-md-6 mb-2">
                  <label className="text-muted">
                    Student Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={studentForm.studentEmail}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        studentEmail: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-12 mt-3">
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
                    value={studentForm.categories.map((cat) => ({
                      value: cat,
                      label:
                        categoryOptions.find((c) => c.value === cat)?.label ||
                        cat,
                    }))}
                    onChange={handleCategoryChange}
                  />
                </div>
                {availableSubjects.length > 0 && (
                  <div className="col-12 mt-3">
                    <label>
                      <strong>
                        Step 2: Select Subjects{" "}
                        <span style={{ color: "red" }}>*</span>
                      </strong>
                    </label>
                    <br />
                    <small className="text-muted">
                      {studentForm.categories.includes("AP-Courses")
                        ? "For AP Courses: Select subject categories, then choose specific courses in Step 3"
                        : "For Grades/College Tests: These are your final selections"}
                    </small>
                    <Select
                      isMulti
                      options={availableSubjects.map((s) => ({
                        value: s,
                        label: s,
                      }))}
                      value={studentForm.subjects.map((s) => ({
                        value: s,
                        label: s,
                      }))}
                      onChange={handleSubjectChange}
                    />
                  </div>
                )}
                {(studentForm.categories.length > 0 ||
                  studentForm.subjects.length > 0) && (
                  <div className="col-12 mt-3">
                    <div className="alert alert-info">
                      <div>
                        <strong>Categories:</strong>{" "}
                        {studentForm.categories.join(", ")}
                      </div>
                      <div>
                        <strong>Subjects:</strong>{" "}
                        {studentForm.subjects.join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 text-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => setShowStudentForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleAddStudent}
                >
                  Save Student
                </button>
              </div>
            </div>
          )}
          {students.length > 0 && (
            <div className="mt-4">
              <h5 className="mb-2">
                <b>Added Students</b>
              </h5>
              {students.map((student, index) => (
                <div key={index} className="card p-3 mb-2 position-relative">
                  {/* Delete Icon */}
                  <i
                    className="fas fa-trash delete-icon"
                    onClick={() => confirmRemoveStudent(index)}
                  ></i>

                  <div>
                    <strong>Name : </strong>
                    {student.studentName}
                    <br />
                    <strong>Email : </strong>
                    {student.studentEmail}
                    <br />
                    <strong>Categories: </strong>
                    {student.categories.join(", ")}
                    <br />
                    <strong>Subjects: </strong>
                    {student.subjects.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button type="submit" className="btn login-btn w-100 mt-4">
            Submit
          </button>
        </form>
      </div>
      {showDeleteModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <p>
                    Are you sure you want to delete student{" "}
                    <strong>{studentToDelete?.name}</strong>?
                  </p>
                  <p>This action cannot be undone.</p>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={handleConfirmDelete}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
