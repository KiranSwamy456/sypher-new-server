"use client";
import { useState, useEffect } from "react";
import RegistrationTable from "@/component/admin/RegistrationTable";
import Select from "react-select";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Multi-level selection state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  
  const [newRegistration, setNewRegistration] = useState({
    parentName: "",
    livesIn: "",
    contactedVia: "",
    studentName: "",
    studentGrade: "",
    schoolName: "",
    phone: "",
    email: "",
    assigneeId: "",
    referredBy: "",
    notes: "",
  });

  // Categories
  const categories = [
    { value: "Grade-1", label: "Grade 1" },
    { value: "Grade-2", label: "Grade 2" },
    { value: "Grade-3", label: "Grade 3" },
    { value: "Grade-4", label: "Grade 4" },
    { value: "Grade-5", label: "Grade 5" },
    { value: "Grade-6", label: "Grade 6" },
    { value: "Grade-7", label: "Grade 7" },
    { value: "Grade-8", label: "Grade 8" },
    { value: "Grade-9", label: "Grade 9 (Freshman Year)" },
    { value: "Grade-10", label: "Grade 10 (Sophomore Year)" },
    { value: "Grade-11", label: "Grade 11 (Junior Year)" },
    { value: "Grade-12", label: "Grade 12 (Senior Year)" },
    { value: "AP-Courses", label: "AP Courses" },
    { value: "College-Tests", label: "College Tests" }
  ];

  // Subject mappings for Grades
  const gradeSubjects = [
    "English Language Arts",
    "Mathematics", 
    "Science",
    "Social Studies",
    "Arts Education",
    "Physical Education/Health"
  ];

  // Subject categories for AP Courses (these will show another dropdown)
  const apSubjectCategories = [
    "English Language Arts",
    "Mathematics",
    "Science", 
    "GENERAL SUBJECTS",
    "COMPUTER SCIENCE"
  ];

  // College Tests (direct selection, no further dropdown)
  const collegeTests = [
    "SAT (Math + English)",
    "SAT Math",
    "SAT English", 
    "PSAT",
    "ACT"
  ];

const handleCategoryChange = (selectedOptions) => {
    const categoryValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedCategories(categoryValues);
    
    // Calculate available subjects based on selected categories
    let subjects = [];
    
    // Check what types of categories are selected
    const hasGrades = categoryValues.some(cat => cat.startsWith('Grade-'));
    const hasAPCourses = categoryValues.includes('AP-Courses');
    const hasCollegeTests = categoryValues.includes('College-Tests');
    
    // Add subjects based on category types
    if (hasGrades) {
      subjects = [...subjects, ...gradeSubjects];
    }
    
    if (hasAPCourses) {
      subjects = [...subjects, ...apSubjectCategories];
    }
    
    if (hasCollegeTests) {
      subjects = [...subjects, ...collegeTests];
    }
    
    // Remove duplicates
    const uniqueSubjects = [...new Set(subjects)];
    console.log('Available subjects after category change:', uniqueSubjects);
    setAvailableSubjects(uniqueSubjects);
    
    // Keep only the subjects that are still valid in the new category selection
    // Filter out subjects that are no longer available
    setSelectedSubjects(prevSubjects => 
      prevSubjects.filter(subject => uniqueSubjects.includes(subject))
    );
    
    // Only clear courses if AP Courses is no longer selected
    if (!hasAPCourses) {
      setSelectedCourses([]);
      setAvailableCourses([]);
    }
  };



 const handleSubjectChange = async (selectedOptions) => {
    const subjectValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedSubjects(subjectValues);
    
    // DON'T reset selectedCourses here anymore - keep existing selections
    
    // Check if AP Courses is selected
    const hasAPCourses = selectedCategories.includes('AP-Courses');
    const hasGrades = selectedCategories.some(cat => cat.startsWith('Grade-'));
    const hasCollegeTests = selectedCategories.includes('College-Tests');
    
    // For AP Courses, we need to fetch courses from database
    // For Grades and College Tests, subjects ARE the final selection (no further dropdown needed)
    if (hasAPCourses && subjectValues.length > 0) {
      // Fetch actual courses for AP subject categories
      await fetchAPCourses(subjectValues);
    } else {
      // For Grades and College Tests, no course dropdown needed
      setAvailableCourses([]);
      // Only clear courses when not dealing with AP Courses
      setSelectedCourses([]);
    }
  };

  const handleCourseChange = (selectedOptions) => {
    const courseValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedCourses(courseValues);
  };

  const fetchAPCourses = async (apSubjectCategories) => {
    try {
      console.log('Fetching AP courses for subject categories:', apSubjectCategories);
      
      let allCourses = [];
      
      // Fetch courses for each AP subject category
      for (const subjectCategory of apSubjectCategories) {
        const response = await fetch(
          `/api/auth/courses/?parent_category=${encodeURIComponent('AP Courses')}&subject_category=${encodeURIComponent(subjectCategory)}`
        );
        
        if (response.ok) {
          const data = await response.json();
          allCourses = [...allCourses, ...data.courses];
        }
      }
      
      // Remove duplicates based on course ID
      const uniqueCourses = allCourses.filter((course, index, self) => 
        index === self.findIndex(c => c.id === course.id)
      );
      
      console.log('AP Courses fetched:', uniqueCourses.length);
      setAvailableCourses(uniqueCourses);
      
      // IMPORTANT: Filter selectedCourses to only include courses that are still available
      // This keeps valid selections when adding new subjects
      setSelectedCourses(prevSelected => 
        prevSelected.filter(courseId => 
          uniqueCourses.some(course => course.id === courseId)
        )
      );
      
    } catch (error) {
      console.error('Error fetching AP courses:', error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/auth/registrations/");
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
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

  const handleCreateRegistration = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      ...newRegistration,
      selectedCategories,
      selectedSubjects,
      selectedCourses,
    };
    
    console.log('=== FRONTEND: Sending registration data ===');
    console.log('Categories:', selectedCategories);
    console.log('Subjects:', selectedSubjects);
    console.log('Courses:', selectedCourses);
    console.log('Full payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch("/api/auth/create-registration/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('=== FRONTEND: Server response ===');
    console.log('Response:', data);

    if (response.ok) {
      console.log('Registration created successfully!');
      fetchRegistrations();
      setShowCreateModal(false);
      resetForm();
      alert('Registration created successfully!');
    } else {
      console.error('Registration failed:', data);
      alert(data.error || 'Failed to create registration');
    }
  } catch (error) {
    console.error("Error creating registration:", error);
    alert('Error creating registration');
  }
};

  const resetForm = () => {
    setSelectedCategories([]);
    setSelectedSubjects([]);
    setSelectedCourses([]);
    setAvailableSubjects([]);
    setAvailableCourses([]);
    setNewRegistration({
      parentName: "",
      livesIn: "",
      contactedVia: "",
      studentName: "",
      studentGrade: "",
      schoolName: "",
      phone: "",
      email: "",
      assigneeId: "",
      referredBy: "",
      notes: "",
    });
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

  // Check if we should show the courses dropdown
  const shouldShowCoursesDropdown = () => {
    return selectedCategories.includes('AP-Courses') && 
           selectedSubjects.length > 0 && 
           availableCourses.length > 0;
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Registrations Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus"></i> Create Registration
        </button>
      </div>

      <RegistrationTable
        registrations={registrations}
        users={users}
        loading={loading}
        onRefresh={refreshData}
      />

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h5>Create New Registration</h5>
              <button onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateRegistration}>
              <div className="modal-body">
                <div className="row">
                  {/* Basic Information Fields */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Parent Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRegistration.parentName}
                        onChange={(e) =>
                          setNewRegistration({
                            ...newRegistration,
                            parentName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Student Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRegistration.studentName}
                        onChange={(e) =>
                          setNewRegistration({
                            ...newRegistration,
                            studentName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Lives In</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRegistration.livesIn}
                        onChange={(e) =>
                          setNewRegistration({
                            ...newRegistration,
                            livesIn: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Contacted Via</label>
                      <select
                        className="form-control"
                        value={newRegistration.contactedVia}
                        onChange={(e) =>
                          setNewRegistration({
                            ...newRegistration,
                            contactedVia: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Method</option>
                        <option value="Phone">Phone</option>
                        <option value="Email">Email</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="In Person">In Person</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Student Grade</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRegistration.studentGrade}
                        onChange={(e) =>
                          setNewRegistration({
                            ...newRegistration,
                            studentGrade: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>School Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRegistration.schoolName}
                        onChange={(e) =>
                          setNewRegistration({
                            ...newRegistration,
                            schoolName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={newRegistration.phone}
                        onChange={(e) =>
                          setNewRegistration({
                            ...newRegistration,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={newRegistration.email}
                        onChange={(e) =>
                          setNewRegistration({
                            ...newRegistration,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Assign To</label>
                      <select
                        className="form-control"
                        value={newRegistration.assigneeId}
                        onChange={(e) =>
                          setNewRegistration({
                            ...newRegistration,
                            assigneeId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select User</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Referred By</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRegistration.referredBy}
                        onChange={(e) =>
                          setNewRegistration({
                            ...newRegistration,
                            referredBy: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label>Notes</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={newRegistration.notes}
                        onChange={(e) =>
                          setNewRegistration({
                            ...newRegistration,
                            notes: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>

                  {/* LEVEL 1: CATEGORY SELECTION */}
                  <div className="col-12">
                    <div className="form-group">
                      <label>
                        <strong>Step 1: Select Categories *</strong>
                        <br />
                        <small className="text-muted">Choose Grades, AP Courses, or College Tests</small>
                      </label>
                      <Select
                        isMulti
                        value={selectedCategories.map((cat) => ({
                          value: cat,
                          label: categories.find(c => c.value === cat)?.label || cat,
                        }))}
                        options={categories}
                        onChange={handleCategoryChange}
                        placeholder="Select categories..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>

                  {/* LEVEL 2: SUBJECT SELECTION */}
                  {availableSubjects.length > 0 && (
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          <strong>Step 2: Select Subjects *</strong>
                          <br />
                          <small className="text-muted">
                            {selectedCategories.includes('AP-Courses') 
                              ? 'For AP Courses: Select subject categories, then choose specific courses in Step 3'
                              : 'For Grades/College Tests: These are your final selections'
                            }
                          </small>
                        </label>
                        <Select
                          isMulti
                          value={selectedSubjects.map((subject) => ({
                            value: subject,
                            label: subject,
                          }))}
                          options={availableSubjects.map((subject) => ({
                            value: subject,
                            label: subject,
                          }))}
                          onChange={handleSubjectChange}
                          placeholder="Select subjects..."
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      </div>
                    </div>
                  )}

                  {/* LEVEL 3: COURSE SELECTION (Only for AP Courses) */}
                  {shouldShowCoursesDropdown() && (
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          <strong>Step 3: Select Specific AP Courses *</strong>
                          <br />
                          <small className="text-muted">Choose the exact AP courses the student needs</small>
                        </label>
                        <Select
                          isMulti
                          value={selectedCourses.map((courseId) => {
                            const course = availableCourses.find(c => c.id === courseId);
                            return course ? {
                              value: course.id,
                              label: course.course_name
                            } : null;
                          }).filter(Boolean)}
                          options={availableCourses.map((course) => ({
                            value: course.id,
                            label: course.course_name,
                          }))}
                          onChange={handleCourseChange}
                          placeholder="Select specific AP courses..."
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      </div>
                    </div>
                  )}

                  {/* SELECTION SUMMARY */}
                  {(selectedCategories.length > 0 || selectedSubjects.length > 0 || selectedCourses.length > 0) && (
                    <div className="col-12">
                      <div className="form-group">
                        <label><strong>Selection Summary:</strong></label>
                        <div className="alert alert-info">
                          <div><strong>Categories:</strong> {selectedCategories.join(', ') || 'None'}</div>
                          <div><strong>Subjects:</strong> {selectedSubjects.join(', ') || 'None'}</div>
                          {selectedCourses.length > 0 && (
                            <div>
                              <strong>AP Courses:</strong>{' '}
                              {availableCourses
                                .filter(c => selectedCourses.includes(c.id))
                                .map(c => c.course_name)
                                .join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
