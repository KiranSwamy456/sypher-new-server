"use client";
import { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import Select from 'react-select';

const StudentTable = ({
  registrations = [],
  users = [],
  loading,
  onRefresh,
}) => {
  const [subjectDetails, setSubjectDetails] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [followupNotes, setFollowupNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [updatingRegistration, setUpdatingRegistration] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubjectsForInvoice, setSelectedSubjectsForInvoice] = useState([]);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  // Edit modal state variables
  const [editSelectedCategories, setEditSelectedCategories] = useState([]);
  const [editSelectedSubjects, setEditSelectedSubjects] = useState([]);
  const [editSelectedCourses, setEditSelectedCourses] = useState([]);
  const [editAvailableSubjects, setEditAvailableSubjects] = useState([]);
  const [editAvailableCourses, setEditAvailableCourses] = useState([]);

  // NEW: Add Record form state
  const [showAddRecordForm, setShowAddRecordForm] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({
    category: '',
    subject: [], // Changed to array for multi-select
    session_start_date: '',
    number_of_sessions: '',
    class_type: ''
  });
  const [availableSubjectsForRecord, setAvailableSubjectsForRecord] = useState([]);
  const [availableAPCoursesForRecord, setAvailableAPCoursesForRecord] = useState([]);
  const [selectedAPCoursesForRecord, setSelectedAPCoursesForRecord] = useState([]);
  const [editingRecordIndex, setEditingRecordIndex] = useState(null); // Track which record is being edited
  const [originalRecord, setOriginalRecord] = useState(null); // Backup of original record before editing

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

  // Helper function to parse JSON data
  const parseJsonData = (jsonString) => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch {
      return typeof jsonString === "string"
        ? jsonString.split(",").map((s) => s.trim()).filter((s) => s)
        : [jsonString];
    }
  };

  // NEW: Handle category change in Add Record form
  const handleRecordCategoryChange = (selectedOption) => {
    const categoryValue = selectedOption ? selectedOption.value : '';
    setCurrentRecord({ ...currentRecord, category: categoryValue, subject: [] });
    setSelectedAPCoursesForRecord([]);
    setAvailableAPCoursesForRecord([]);

    let subjects = [];
    if (categoryValue.startsWith("Grade-")) {
      subjects = gradeSubjects;
    } else if (categoryValue === "AP-Courses") {
      subjects = apSubjectCategories;
    } else if (categoryValue === "College-Tests") {
      subjects = collegeTests;
    }

    setAvailableSubjectsForRecord(subjects);
  };

  // NEW: Handle subject change in Add Record form - fetch AP courses if needed
  const handleRecordSubjectChange = async (selectedOptions) => {
    const subjectValues = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    setCurrentRecord({
      ...currentRecord,
      subject: subjectValues
    });

    console.log('Subject changed:', subjectValues);
    console.log('Current category:', currentRecord.category);

    // If AP-Courses category and subjects selected, fetch AP courses
    if (currentRecord.category === "AP-Courses" && subjectValues.length > 0) {
      console.log('Fetching AP courses for subjects:', subjectValues);
      try {
        let allCourses = [];

        for (const subjectCategory of subjectValues) {
          console.log('Fetching courses for category:', subjectCategory);
          const response = await fetch(
            `/api/auth/courses/?parent_category=${encodeURIComponent(
              "AP Courses"
            )}&subject_category=${encodeURIComponent(subjectCategory)}`
          );

          if (response.ok) {
            const data = await response.json();
            console.log('Courses received:', data.courses);
            allCourses = [...allCourses, ...data.courses];
          }
        }

        const uniqueCourses = allCourses.filter(
          (course, index, self) =>
            index === self.findIndex((c) => c.id === course.id)
        );

        console.log('Total unique AP courses:', uniqueCourses.length);
        setAvailableAPCoursesForRecord(uniqueCourses);
      } catch (error) {
        console.error("Error fetching AP courses:", error);
      }
    } else {
      setAvailableAPCoursesForRecord([]);
      setSelectedAPCoursesForRecord([]);
    }
  };

  // NEW: Add record to the grid
  const handleAddRecord = () => {
    if (!currentRecord.category || !currentRecord.subject || currentRecord.subject.length === 0 ||
        !currentRecord.session_start_date || !currentRecord.number_of_sessions || 
        !currentRecord.class_type) {
      alert('Please fill all fields');
      return;
    }

    // If editing an existing record, update it
    if (editingRecordIndex !== null) {
      // Create updated record
      const updatedRecord = {
        category: currentRecord.category,
        subject: currentRecord.subject[0], // Take first subject when editing
        session_start_date: currentRecord.session_start_date,
        number_of_sessions: currentRecord.number_of_sessions,
        class_type: currentRecord.class_type
      };

      // Update the record at the editing index
      const updatedDetails = [...subjectDetails];
      updatedDetails[editingRecordIndex] = updatedRecord;
      setSubjectDetails(updatedDetails);

      // Update categories and subjects
      const remainingSubjects = updatedDetails.map(sd => sd.subject);
      setEditSelectedSubjects(remainingSubjects);
      
      const remainingCategories = [...new Set(updatedDetails.map(sd => sd.category))];
      setEditSelectedCategories(remainingCategories);

      // Reset editing state
      setEditingRecordIndex(null);
    } else {
      // Adding new records
      const newRecords = currentRecord.subject.map(subject => ({
        category: currentRecord.category,
        subject: subject,
        session_start_date: currentRecord.session_start_date,
        number_of_sessions: currentRecord.number_of_sessions,
        class_type: currentRecord.class_type
      }));

      // Check for duplicates (same subject + same category)
      const duplicates = newRecords.filter(newRec => 
        subjectDetails.some(sd => sd.subject === newRec.subject && sd.category === newRec.category)
      );

      if (duplicates.length > 0) {
        alert(`These subjects already exist in ${currentRecord.category}: ${duplicates.map(d => d.subject).join(', ')}. Please edit them instead.`);
        return;
      }

      setSubjectDetails([...subjectDetails, ...newRecords]);
      
      // Update editSelectedCategories and editSelectedSubjects
      if (!editSelectedCategories.includes(currentRecord.category)) {
        setEditSelectedCategories([...editSelectedCategories, currentRecord.category]);
      }
      
      const newSubjects = currentRecord.subject.filter(s => !editSelectedSubjects.includes(s));
      if (newSubjects.length > 0) {
        setEditSelectedSubjects([...editSelectedSubjects, ...newSubjects]);
      }
    }

    // Add selected AP courses to editSelectedCourses
    if (selectedAPCoursesForRecord.length > 0) {
      const newCourses = selectedAPCoursesForRecord.filter(c => !editSelectedCourses.includes(c));
      if (newCourses.length > 0) {
        setEditSelectedCourses([...editSelectedCourses, ...newCourses]);
      }
    }

    // Reset form
    setCurrentRecord({
      category: '',
      subject: [],
      session_start_date: '',
      number_of_sessions: '',
      class_type: ''
    });
    setShowAddRecordForm(false);
    setAvailableSubjectsForRecord([]);
    setAvailableAPCoursesForRecord([]);
    setSelectedAPCoursesForRecord([]);
  };

  // NEW: Delete record from grid
  const handleDeleteRecord = (index) => {
    const updatedDetails = subjectDetails.filter((_, i) => i !== index);
    setSubjectDetails(updatedDetails);
    
    // Update editSelectedSubjects to only include subjects that still exist
    const remainingSubjects = updatedDetails.map(sd => sd.subject);
    setEditSelectedSubjects(remainingSubjects);
    
    // Update editSelectedCategories to only include categories that still exist
    const remainingCategories = [...new Set(updatedDetails.map(sd => sd.category))];
    setEditSelectedCategories(remainingCategories);
    
    // If no more AP-Courses records exist, clear AP courses selection
    const hasAPCourses = remainingCategories.includes('AP-Courses');
    if (!hasAPCourses) {
      setEditSelectedCourses([]);
      setEditAvailableCourses([]);
    }
  };

  // NEW: Edit record from grid
  const handleEditRecord = (index) => {
    console.log('Editing record at index:', index);
    const record = subjectDetails[index];
    console.log('Original record:', record);
    
    // Save original record as backup
    setOriginalRecord({ ...record });
    
    setCurrentRecord({ 
      ...record,
      subject: [record.subject] // Convert to array for multi-select
    });
    
    // Set available subjects for the category
    let subjects = [];
    if (record.category.startsWith("Grade-")) {
      subjects = gradeSubjects;
    } else if (record.category === "AP-Courses") {
      subjects = apSubjectCategories;
    } else if (record.category === "College-Tests") {
      subjects = collegeTests;
    }
    setAvailableSubjectsForRecord(subjects);
    
    // Set the editing index so we know we're editing, not adding
    setEditingRecordIndex(index);
    setShowAddRecordForm(true);
    
    console.log('Edit mode activated. Index:', index);
  };

  const handleEditCategoryChange = (selectedOptions) => {
    const categoryValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setEditSelectedCategories(categoryValues);

    let subjects = [];
    const hasGrades = categoryValues.some((cat) => cat.startsWith("Grade-"));
    const hasAPCourses = categoryValues.includes("AP-Courses");
    const hasCollegeTests = categoryValues.includes("College-Tests");

    if (hasGrades) {
      subjects = [...subjects, ...gradeSubjects];
    }
    if (hasAPCourses) {
      subjects = [...subjects, ...apSubjectCategories];
    }
    if (hasCollegeTests) {
      subjects = [...subjects, ...collegeTests];
    }

    const uniqueSubjects = [...new Set(subjects)];
    setEditAvailableSubjects(uniqueSubjects);

    setEditSelectedSubjects((prevSubjects) =>
      prevSubjects.filter((subject) => uniqueSubjects.includes(subject))
    );

    if (!hasAPCourses) {
      setEditSelectedCourses([]);
      setEditAvailableCourses([]);
    }
  };

  const handleEditSubjectChange = async (selectedOptions) => {
    const subjectValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setEditSelectedSubjects(subjectValues);

    const hasAPCourses = editSelectedCategories.includes("AP-Courses");

    if (hasAPCourses && subjectValues.length > 0) {
      await fetchEditAPCourses(subjectValues);
    } else {
      setEditAvailableCourses([]);
      setEditSelectedCourses([]);
    }
  };

  const fetchEditAPCourses = async (apSubjectCategories) => {
    try {
      let allCourses = [];

      for (const subjectCategory of apSubjectCategories) {
        const response = await fetch(
          `/api/auth/courses/?parent_category=${encodeURIComponent(
            "AP Courses"
          )}&subject_category=${encodeURIComponent(subjectCategory)}`
        );

        if (response.ok) {
          const data = await response.json();
          allCourses = [...allCourses, ...data.courses];
        }
      }

      const uniqueCourses = allCourses.filter(
        (course, index, self) =>
          index === self.findIndex((c) => c.id === course.id)
      );

      setEditAvailableCourses(uniqueCourses);

      setEditSelectedCourses((prevSelected) =>
        prevSelected.filter((courseId) =>
          uniqueCourses.some((course) => course.id === courseId)
        )
      );
    } catch (error) {
      console.error("Error fetching AP courses:", error);
    }
  };

  const handleEditRegistration = async (registrationId) => {
    try {
      const response = await fetch(`/api/auth/students/${registrationId}/`);
      if (response.ok) {
        const data = await response.json();
        const reg = data.student;
        
        setEditingRegistration(reg);
        
        const categories = parseJsonData(reg.selected_categories);
        const subjects = parseJsonData(reg.selected_subjects);
        const courses = parseJsonData(reg.selected_courses);
        
        // Parse subject details if they exist
        let parsedSubjectDetails = [];
        if (reg.subject_details) {
          try {
            parsedSubjectDetails = JSON.parse(reg.subject_details);
          } catch (e) {
            console.error('Error parsing subject_details:', e);
          }
        }
        
        setSubjectDetails(parsedSubjectDetails);
        setEditSelectedCategories(categories);
        setEditSelectedSubjects(subjects);
        setEditSelectedCourses(courses);
        
        let availSubjects = [];
        const hasGrades = categories.some(cat => cat.startsWith('Grade-'));
        const hasAPCourses = categories.includes('AP-Courses');
        const hasCollegeTests = categories.includes('College-Tests');
        
        if (hasGrades) availSubjects = [...availSubjects, ...gradeSubjects];
        if (hasAPCourses) availSubjects = [...availSubjects, ...apSubjectCategories];
        if (hasCollegeTests) availSubjects = [...availSubjects, ...collegeTests];
        
        setEditAvailableSubjects([...new Set(availSubjects)]);
        
        if (hasAPCourses && subjects.length > 0) {
          await fetchEditAPCourses(subjects);
        }
        
        setShowEditModal(true);
      }
    } catch (error) {
      console.error("Error fetching registration:", error);
    }
  };

  const handleUpdateRegistration = async (e) => {
    e.preventDefault();
    setUpdatingRegistration(true);

    try {
      const response = await fetch(
        `/api/auth/students/${editingRegistration.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editingRegistration,
            selectedCategories: editSelectedCategories,
            selectedSubjects: editSelectedSubjects,
            selectedCourses: editSelectedCourses,
            subjectDetails: subjectDetails
          }),
        }
      );

      if (response.ok) {
        onRefresh();
        setShowEditModal(false);
        setEditingRegistration(null);
        setEditSelectedCategories([]);
        setEditSelectedSubjects([]);
        setEditSelectedCourses([]);
        setEditAvailableSubjects([]);
        setEditAvailableCourses([]);
        setSubjectDetails([]);
        setShowAddRecordForm(false);
        alert("Registration updated successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update registration");
      }
    } catch (error) {
      alert("Error updating registration");
      console.error("Update registration error:", error);
    } finally {
      setUpdatingRegistration(false);
    }
  };

  const handleDeleteRegistration = async (registrationId, studentName) => {
    if (
      !window.confirm(
        `Are you sure you want to disable student for "${studentName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(registrationId);
    try {
      const response = await fetch(
        `/api/auth/students/${registrationId}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        onRefresh();
      } else {
        alert("Failed to delete student");
      }
    } catch (error) {
      alert("Error deleting student");
      console.error("Delete student error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const openNotesModal = (registration) => {
    setSelectedRegistration(registration);
    setShowNotesModal(true);
  };

  const handleGenerateInvoice = async (studentId) => {
    try {
      const response = await fetch(`/api/auth/students/${studentId}/`);
      if (response.ok) {
        const data = await response.json();
        const student = data.student;
        
        let subjectDetailsData = [];
        if (student.subject_details) {
          try {
            subjectDetailsData = JSON.parse(student.subject_details);
          } catch (e) {
            console.error('Error parsing subject_details:', e);
          }
        }
        
        const validSubjects = subjectDetailsData.filter(
          sd => sd.session_start_date && sd.number_of_sessions && sd.class_type
        );
        
        if (validSubjects.length === 0) {
          alert('No subjects with complete session details found.');
          return;
        }
        
        setSelectedStudent({...student, validSubjects});
        setSelectedSubjectsForInvoice([]);
        setShowInvoiceModal(true);
      }
    } catch (error) {
      console.error('Error loading student data:', error);
      alert('Error loading student data');
    }
  };


const handleSubjectCheckboxChange = (index) => {
  setSelectedSubjectsForInvoice(prev => 
    prev.includes(index) 
      ? prev.filter(i => i !== index) 
      : [...prev, index]
  );
};

const handleGenerateInvoiceFromModal = async () => {
  if (selectedSubjectsForInvoice.length === 0) {
    alert('Please select at least one subject');
    return;
  }
  
  setGeneratingInvoice(true);
  
  try {
    // Send complete subject objects with all details
    const selectedSubjectDetails = selectedSubjectsForInvoice.map(index => 
      selectedStudent.validSubjects[index]
    );
    
    console.log('Sending complete subject details:', selectedSubjectDetails);
    
    const response = await fetch('/api/auth/invoices/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        studentId: selectedStudent.id,
        selectedSubjects: selectedSubjectDetails  // Send complete objects, not just names
      })
    });

    if (response.ok) {
      const data = await response.json();
      alert(`Invoice ${data.invoice.invoice_number} generated successfully!`);
      
      window.open(data.invoice.pdf_path, '_blank');
      
      setShowInvoiceModal(false);
      onRefresh();
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to generate invoice');
    }
  } catch (error) {
    console.error('Generate invoice error:', error);
    alert('Error generating invoice');
  } finally {
    setGeneratingInvoice(false);
  }
};

  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '60px',
    },
    {
      name: 'Parent Name',
      selector: row => row.parent_name || 'N/A',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Student Name',
      selector: row => row.student_name || 'N/A',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Grade',
      selector: row => row.student_grade || 'N/A',
      sortable: true,
      width: '80px',
    },
    {
      name: 'Phone',
      selector: row => row.phone || 'N/A',
      sortable: true,
      width: '130px',
    },
    {
      name: 'Email',
      selector: row => row.email || 'N/A',
      sortable: true,
      width: '180px',
    },
    {
      name: 'Assigned To',
      selector: row => row.assignee_name || 'Unassigned',
      sortable: true,
      width: '130px',
    },
    {
      name: 'Categories',
      cell: row => (
        row.selected_categories && Array.isArray(row.selected_categories) ? (
          <div>
            {row.selected_categories.map((category, index) => (
              <span key={index} className="badge bg-info me-1 mb-1" style={{fontSize: '10px'}}>
                {category}
              </span>
            ))}
          </div>
        ) : <span className="text-muted">-</span>
      ),
      width: '200px',
    },
    {
      name: 'Subjects',
      cell: row => (
        row.selected_subjects && Array.isArray(row.selected_subjects) ? (
          <div>
            {row.selected_subjects.map((subject, index) => (
              <span key={index} className="badge bg-info me-1 mb-1" style={{fontSize: '10px'}}>
                {subject}
              </span>
            ))}
          </div>
        ) : <span className="text-muted">-</span>
      ),
      width: '200px',
    },
    {
      name: 'Courses',
      cell: row => (
        row.course_details && row.course_details.length > 0 ? (
          <div>
            {row.course_details.map((course) => (
              <span key={course.id} className="badge bg-primary me-1 mb-1" style={{fontSize: '10px'}}>
                {course.name}
              </span>
            ))}
          </div>
        ) : <span className="text-muted">No courses</span>
      ),
      width: '250px',
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-outline-primary tooltip-btn"
            title="Edit Student Info"
            onClick={() => handleEditRegistration(row.id)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className={`btn btn-sm tooltip-btn ${
              row.subject_details
                ? "btn-outline-success"
                : "btn-outline-secondary"
            }`}
            title={
              row.subject_details
                ? "Generate/View Invoice"
                : "Complete session details to generate invoice"
            }
            onClick={() =>
              row.subject_details
                ? handleGenerateInvoice(row.id)
                : null
            }
            disabled={!row.subject_details}
          >
            <i className="fas fa-file-invoice-dollar"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger tooltip-btn"
            title="Disable Student"
            onClick={() => handleDeleteRegistration(row.id, row.student_name)}
            disabled={deletingId === row.id}
          >
            {deletingId === row.id ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-times"></i>
            )}
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
      width: '200px',
    },
  ], [deletingId]);

  const filteredItems = registrations.filter(item => {
    const searchStr = filterText.toLowerCase();
    return (
      item.parent_name?.toLowerCase().includes(searchStr) ||
      item.student_name?.toLowerCase().includes(searchStr) ||
      item.phone?.toLowerCase().includes(searchStr) ||
      item.email?.toLowerCase().includes(searchStr)
    );
  });

  const subHeaderComponent = useMemo(() => {
    return (
      <input
        type="text"
        placeholder="Search students..."
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
          noDataComponent="No students found"
          defaultSortFieldId={1}
        /> 
      </div>

      {showEditModal && editingRegistration && (
        <div className="modal-overlay">
          <div className="modal-content large-modal" style={{maxWidth: '900px'}}>
            <div className="modal-header">
              <h5>Update Student Info</h5>
              <button onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpdateRegistration}>
              <div className="modal-body" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Parent Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingRegistration.parent_name || ""}
                        onChange={(e) =>
                          setEditingRegistration({
                            ...editingRegistration,
                            parent_name: e.target.value,
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
                        value={editingRegistration.student_name || ""}
                        onChange={(e) =>
                          setEditingRegistration({
                            ...editingRegistration,
                            student_name: e.target.value,
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
                        value={editingRegistration.lives_in || ""}
                        onChange={(e) =>
                          setEditingRegistration({
                            ...editingRegistration,
                            lives_in: e.target.value,
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
                        value={editingRegistration.contacted_via || ""}
                        onChange={(e) =>
                          setEditingRegistration({
                            ...editingRegistration,
                            contacted_via: e.target.value,
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
                        value={editingRegistration.student_grade || ""}
                        onChange={(e) =>
                          setEditingRegistration({
                            ...editingRegistration,
                            student_grade: e.target.value,
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
                        value={editingRegistration.school_name || ""}
                        onChange={(e) =>
                          setEditingRegistration({
                            ...editingRegistration,
                            school_name: e.target.value,
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
                        value={editingRegistration.phone || ""}
                        onChange={(e) =>
                          setEditingRegistration({
                            ...editingRegistration,
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
                        value={editingRegistration.email || ""}
                        onChange={(e) =>
                          setEditingRegistration({
                            ...editingRegistration,
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
                        value={editingRegistration.assignee_id || ""}
                        onChange={(e) =>
                          setEditingRegistration({
                            ...editingRegistration,
                            assignee_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Select User</option>
                        {users && users.length > 0 ? (
                          users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))
                        ) : (
                          <option value="">Loading users...</option>
                        )}
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Referred By</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingRegistration.referred_by || ""}
                        onChange={(e) =>
                          setEditingRegistration({
                            ...editingRegistration,
                            referred_by: e.target.value,
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
                        value={editingRegistration.notes || ""}
                        onChange={(e) =>
                          setEditingRegistration({
                            ...editingRegistration,
                            notes: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-12">
                    <hr className="my-4" />
                  </div>

                  {/* NEW: Subject Session Records Grid */}
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">
                        <strong>Subject Session Records</strong>
                      </h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => setShowAddRecordForm(true)}
                      >
                        <i className="fas fa-plus me-2"></i>
                        Add Record
                      </button>
                    </div>

                    {/* Subject Records Grid */}
                    {subjectDetails.length > 0 && (
                      <div className="table-responsive mb-3">
                        <table className="table table-sm table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th style={{width: '50px'}}>S.No</th>
                              <th>Subject</th>
                              <th>Category</th>
                              <th>Start Date</th>
                              <th>Sessions</th>
                              <th>Class Type</th>
                              <th style={{width: '100px'}}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subjectDetails.map((record, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>{record.subject}</td>
                                <td>
                                  <span className="badge bg-info">
                                    {record.category}
                                  </span>
                                </td>
                                <td>{new Date(record.session_start_date).toLocaleDateString()}</td>
                                <td>{record.number_of_sessions}</td>
                                <td>{record.class_type}</td>
                                <td className="text-center">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary me-1"
                                    onClick={() => handleEditRecord(index)}
                                    title="Edit"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteRecord(index)}
                                    title="Delete"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Add Record Form */}
                    {showAddRecordForm && (
                      <div className="border rounded p-3 mb-3" style={{backgroundColor: '#f8f9fa'}}>
                        <h6 className="mb-3">
                          <i className={`fas ${editingRecordIndex !== null ? 'fa-edit' : 'fa-plus-circle'} me-2`}></i>
                          {editingRecordIndex !== null ? 'Edit Subject Record' : 'Add New Subject Record'}
                        </h6>
                        
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Category *</label>
                            <Select
                              value={currentRecord.category ? {
                                value: currentRecord.category,
                                label: categories.find(c => c.value === currentRecord.category)?.label || currentRecord.category
                              } : null}
                              options={categories}
                              onChange={handleRecordCategoryChange}
                              placeholder="Select category..."
                              className="react-select-container"
                              classNamePrefix="react-select"
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="form-label">Subject * (Multi-select)</label>
                            <Select
                              isMulti
                              value={currentRecord.subject.map(s => ({
                                value: s,
                                label: s
                              }))}
                              options={availableSubjectsForRecord.map(s => ({
                                value: s,
                                label: s
                              }))}
                              onChange={handleRecordSubjectChange}
                              placeholder="Select subjects..."
                              className="react-select-container"
                              classNamePrefix="react-select"
                              isDisabled={!currentRecord.category}
                            />
                          </div>

                          {/* Step 3: AP Courses Selection */}
                          {currentRecord.category === "AP-Courses" && 
                           currentRecord.subject.length > 0 && (
                            <div className="col-12 mb-3">
                              <label className="form-label">
                                <strong>Step 3: Select Specific AP Courses *</strong>
                                <br />
                                <small className="text-muted">
                                  Choose the exact AP courses for this student
                                </small>
                              </label>
                              {availableAPCoursesForRecord.length === 0 ? (
                                <div className="alert alert-info">
                                  <i className="fas fa-spinner fa-spin me-2"></i>
                                  Loading AP courses...
                                </div>
                              ) : (
                                <Select
                                  isMulti
                                  value={selectedAPCoursesForRecord.map(courseId => {
                                    const course = availableAPCoursesForRecord.find(c => c.id === courseId);
                                    return course ? {
                                      value: course.id,
                                      label: course.course_name
                                    } : null;
                                  }).filter(Boolean)}
                                  options={availableAPCoursesForRecord.map(course => ({
                                    value: course.id,
                                    label: course.course_name
                                  }))}
                                  onChange={(selectedOptions) => {
                                    setSelectedAPCoursesForRecord(
                                      selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                    );
                                  }}
                                  placeholder="Select specific AP courses..."
                                  className="react-select-container"
                                  classNamePrefix="react-select"
                                />
                              )}
                            </div>
                          )}

                          <div className="col-md-4 mb-3">
                            <label className="form-label">Session Start Date *</label>
                            <input
                              type="date"
                              className="form-control"
                              value={currentRecord.session_start_date || ''}
                              onChange={(e) => setCurrentRecord({
                                ...currentRecord,
                                session_start_date: e.target.value
                              })}
                            />
                          </div>

                          <div className="col-md-4 mb-3">
                            <label className="form-label">Number of Sessions *</label>
                            <select
                              className="form-control"
                              value={currentRecord.number_of_sessions || ''}
                              onChange={(e) => setCurrentRecord({
                                ...currentRecord,
                                number_of_sessions: e.target.value
                              })}
                            >
                              <option value="">Select Sessions</option>
                              <option value="10">10 Sessions</option>
                              <option value="35">35 Sessions</option>
                              <option value="70">70 Sessions</option>
                            </select>
                          </div>

                          <div className="col-md-4 mb-3">
                            <label className="form-label">Class Type *</label>
                            <select
                              className="form-control"
                              value={currentRecord.class_type || ''}
                              onChange={(e) => setCurrentRecord({
                                ...currentRecord,
                                class_type: e.target.value
                              })}
                            >
                              <option value="">Select Type</option>
                              <option value="1 on 1">1 on 1</option>
                              <option value="Group 2 to 4">Group 2 to 4</option>
                            </select>
                          </div>

                          <div className="col-12">
                            <button
                              type="button"
                              className="btn btn-success me-2"
                              onClick={handleAddRecord}
                            >
                              <i className="fas fa-check me-2"></i>
                              {editingRecordIndex !== null ? 'Update Record' : 'Add Record'}
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => {
                                console.log('Cancel clicked. Editing index:', editingRecordIndex);
                                
                                // If we were editing, the original record is still in the array
                                // No need to restore anything - just close the form
                                
                                setShowAddRecordForm(false);
                                setEditingRecordIndex(null);
                                setOriginalRecord(null);
                                setCurrentRecord({
                                  category: '',
                                  subject: [],
                                  session_start_date: '',
                                  number_of_sessions: '',
                                  class_type: ''
                                });
                                setAvailableSubjectsForRecord([]);
                                setAvailableAPCoursesForRecord([]);
                                setSelectedAPCoursesForRecord([]);
                                
                                console.log('Form closed, record should still be visible');
                              }}
                            >
                              <i className="fas fa-times me-2"></i>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {subjectDetails.length === 0 && !showAddRecordForm && (
                      <div className="alert alert-info">
                        <i className="fas fa-info-circle me-2"></i>
                        No subject records added yet. Click "Add Record" to start.
                      </div>
                    )}
                  </div>

                  {/* Selection Summary */}
                  {(editSelectedCategories.length > 0 ||
                    editSelectedSubjects.length > 0 ||
                    editSelectedCourses.length > 0) && (
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          <strong>Selection Summary:</strong>
                        </label>
                        <div className="alert alert-info">
                          <div>
                            <strong>Total Subject Records:</strong>{" "}
                            {subjectDetails.length}
                          </div>
                          {editSelectedCourses.length > 0 && (
                            <div>
                              <strong>AP Courses:</strong>{" "}
                              {editAvailableCourses
                                .filter((c) =>
                                  editSelectedCourses.includes(c.id)
                                )
                                .map((c) => c.course_name)
                                .join(", ")}
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
                  onClick={() => {
                    setShowEditModal(false);
                    setShowAddRecordForm(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updatingRegistration}
                >
                  {updatingRegistration ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Student Info"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Selection Modal */}
      {showInvoiceModal && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h5>Generate Invoice - {selectedStudent.student_name}</h5>
              <button onClick={() => setShowInvoiceModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-info">
                <strong>Select subjects to include in the invoice:</strong>
              </div>
              
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{width: '50px'}}>
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubjectsForInvoice(
                                selectedStudent.validSubjects.map((_, idx) => idx)
                              );
                            } else {
                              setSelectedSubjectsForInvoice([]);
                            }
                          }}
                          checked={selectedSubjectsForInvoice.length === selectedStudent.validSubjects.length}
                        />
                      </th>
                      <th>Subject</th>
                      <th>Category</th>
                      <th>Session Start Date</th>
                      <th>Number of Sessions</th>
                      <th>Class Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.validSubjects.map((subject, index) => (
                      <tr key={index}>
                        <td className="text-center">
                          <input
  type="checkbox"
  checked={selectedSubjectsForInvoice.includes(index)}           // ← Change to index
  onChange={() => handleSubjectCheckboxChange(index)}            // ← Change to index
/>
                         </td>
                        <td><strong>{subject.subject}</strong></td>
                        <td>
                          <span className="badge bg-info">
                            {subject.category || 'N/A'}
                          </span>
                        </td>
                        <td>{new Date(subject.session_start_date).toLocaleDateString()}</td>
                        <td>{subject.number_of_sessions}</td>
                        <td>{subject.class_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {selectedSubjectsForInvoice.length > 0 && (
                <div className="alert alert-success mt-3">
                  <strong>Selected:</strong> {selectedSubjectsForInvoice.length} subject(s)
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowInvoiceModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleGenerateInvoiceFromModal}
                disabled={selectedSubjectsForInvoice.length === 0 || generatingInvoice}
              >
                {generatingInvoice ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-invoice-dollar me-2"></i>
                    Generate Invoice ({selectedSubjectsForInvoice.length} subject{selectedSubjectsForInvoice.length !== 1 ? 's' : ''})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentTable;
