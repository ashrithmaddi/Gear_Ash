import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Courses.css";
import ImageUpload from "./ImageUpload";
import { createCoursePlaceholder } from "../utils/placeholderUtils";
import config from "../config/config";

const API_BASE_URL = config.apiBaseUrl;

function Courses() {

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({})
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [activeSubForm, setActiveSubForm] = useState("basic");
  const [courses, setCourses] = useState([]); // Ensure courses is initialized as an empty array
  const [currentCourse, setCurrentCourse] = useState({
    title: "",
    category: "",
    description: "",
    level: "",
    status: "Free",
    estimatedDuration: "",
    prerequisites: "",
    price: "",
    enabled: true,
    sections: [],
  });

  const [addImage, setAddImage] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState(null);
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [sections, setSections] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    activeCourses: 0,
  });
  const [coursesFilter, setCoursesFilter] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [categories, setCategories] = useState([]); 
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [availableSections, setAvailableSections] = useState([]);

  const [lessonCourseId, setLessonCourseId] = useState("");
  const [lessonSections, setLessonSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [editCourse, setEditCourse] = useState(null);
  const [editSection, setEditSection] = useState(null);
  const [editLesson, setEditLesson] = useState(null);
  const [editQuiz, setEditQuiz] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/getCourseList`);
        setCourses(res.data.courseList || []);
      } catch (error) {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/getCourseStatistics`);
        // Fetch enabled (active) courses count
        const activeRes = await axios.get(`${API_BASE_URL}/api/admin/getActiveCourses`);
        setStatistics({
          ...res.data,
          activeCourses: activeRes.data.activeCourses
        });
      } catch (error) {
        setStatistics({ totalCourses: 0, activeCourses: 0 });
      }
    };
    fetchStatistics();
  }, []);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategories();
  }, []);


  const handleAddCourse = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      const formData = new FormData();
      Object.entries(addForm).forEach(([key, value]) => formData.append(key, value));
      const res = await axios.post(`${API_BASE_URL}/api/courses/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCourses([...courses, res.data]);
      setShowAddModal(false);
      setAddForm({ title: "", category: "", description: "", level: "", status: "Free", estimatedDuration: "", prerequisites: "", price: "", enabled: true, image: null });
      setAddImage(null);
      setAddImagePreview(null);
    } catch (err) {
      setAddError(err.response?.data?.message || err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleBasicFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const categoryName = formData.get("category").trim();

    try {
      const categoryResponse = await axios.post(`${API_BASE_URL}/api/categories/add`, { name: categoryName });
      const category = categoryResponse.data;

      const newCourse = {
        title: formData.get("title"),
        category: category.name, // Use the category name from the response
        description: formData.get("description"),
        level: formData.get("level"),
        sections: sections, // Include sections with lessons and quizzes
      };

      const courseResponse = await axios.post(`${API_BASE_URL}/api/courses/add`, newCourse);
      const addedCourse = {
        ...courseResponse.data,
        sections: courseResponse.data.sections || [] // Ensure sections is always an array
      };
      setCourses([...courses, addedCourse]); // Update the course list dynamically
      setShowAddCourseForm(false); // Close the form
      setActiveSubForm("basic"); // Reset the form state
      setSections([]); // Clear sections
    } catch (error) {
      console.error("Error adding course or category:", error.response?.data?.message || error.message);
      alert("Failed to add course or category. Please check your backend connection.");
    }
  };

  // Handle section form submission
  const handleSectionFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const courseId = formData.get("course"); // Get the selected course ID
    const newSection = {
      title: formData.get("sectionTitle"),
      lessons: [],
      quizzes: [],
    };

    try {
      // Add the section to the selected course
      const response = await axios.put(`${API_BASE_URL}/api/courses/update/${courseId}`, {
        $push: { sections: newSection },
      });
      const updatedCourse = {
        ...response.data,
        sections: response.data.sections || [] // Ensure sections is always an array
      };

      // Update the courses state with the updated course
      setCourses(courses.map((course) => (course._id === updatedCourse._id ? updatedCourse : course)));
      setSections([]); // Clear the sections state
      setActiveSubForm("lesson"); // Move to the "Add Lesson" form
    } catch (error) {
      console.error("Error adding section:", error.response?.data?.message || error.message);
    }
  };

  // Update handleLessonFormSubmit to actually send the lesson to the backend for the selected section
  const [lessonFormError, setLessonFormError] = useState("");

  const handleLessonFormSubmit = async (e) => {
    e.preventDefault();
    setLessonFormError(""); // Reset error before submit

    const formData = new FormData(e.target);
    const lessonCourse = formData.get("lessonCourse");
    const sectionId = selectedSection || formData.get("section");
    const lessonType = formData.get("lessonType");
    const lessonTitle = formData.get("lessonTitle");
    const summary = formData.get("summary");
    const videoUrl = formData.get("videoUrl") || "";

    // Validation
    if (!lessonCourse || !sectionId || !lessonType || !lessonTitle || !summary) {
      setLessonFormError("All fields are required.");
      return;
    }
    if (lessonType === "Video" && !videoUrl) {
      setLessonFormError("Video URL is required for Video lessons.");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/courses/add-lesson/${lessonCourse}/${sectionId}`,
        {
          title: lessonTitle,
          type: lessonType,
          summary,
          videoUrl,
        }
      );
      alert("Lesson added successfully!");
      setLessons([]);
      setLessonFormError("");
      setActiveSubForm("quiz");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      setLessonFormError(msg);
      alert("Failed to add lesson: " + msg);
    }
  };

  // Add state for quiz form fields and error
  const [quizForm, setQuizForm] = useState({
    quizTitle: "",
    section: "",
    instructions: "",
    timeLimit: 60,
    questions: [
      // Example: { question: "", options: ["", "", "", ""], answer: "", marks: 1 }
    ],
  });
  const [quizFormError, setQuizFormError] = useState("");

  // Calculate total marks for the quiz
  const calculateTotalMarks = () => {
    return quizForm.questions.reduce((total, question) => {
      return total + (parseInt(question.marks) || 0);
    }, 0);
  };

  // Add marks to each question in quizForm
  const handleQuizInputChange = (e, idx, field, optIdx) => {
    if (typeof idx === "number") {
      setQuizForm((prev) => {
        const questions = [...prev.questions];
        if (field === "options") {
          questions[idx].options[optIdx] = e.target.value;
        } else if (field === "answer") {
          questions[idx].answer = e.target.value;
        } else if (field === "marks") {
          questions[idx].marks = parseInt(e.target.value) || 1;
        } else {
          questions[idx][field] = e.target.value;
        }
        return { ...prev, questions };
      });
    } else {
      setQuizForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Add a new question
  const handleAddQuestion = () => {
    setQuizForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", options: ["", "", "", ""], answer: "", marks: 1 },
      ],
    }));
  };

  // Remove a question
  const handleRemoveQuestion = (idx) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx),
    }));
  };

  // Handle quiz form submit
  const handleQuizFormSubmit = async (e) => {
    e.preventDefault();
    setQuizFormError("");
    
    // Validate quiz
    if (!quizForm.quizTitle || !quizForm.section) {
      setQuizFormError("Quiz title and section are required.");
      return;
    }
    
    if (quizForm.questions.length === 0) {
      setQuizFormError("At least one question is required.");
      return;
    }
    
    // Validate each question
    for (let i = 0; i < quizForm.questions.length; i++) {
      const q = quizForm.questions[i];
      if (!q.question.trim()) {
        setQuizFormError(`Question ${i + 1} text is required.`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        setQuizFormError(`Question ${i + 1} must have all 4 options filled.`);
        return;
      }
      if (!q.answer || !["1", "2", "3", "4"].includes(q.answer)) {
        setQuizFormError(`Question ${i + 1} must have a valid answer (1, 2, 3, or 4).`);
        return;
      }
      if (!q.marks || q.marks <= 0) {
        setQuizFormError(`Question ${i + 1} must have valid marks (positive number).`);
        return;
      }
    }
    
    try {
      // Find the selected section object to get its course ID
      const selectedSectionObj = sections.find(s => s._id === quizForm.section);
      if (!selectedSectionObj) {
        setQuizFormError("Selected section not found.");
        return;
      }

      // Prepare quiz data
      const quizData = {
        title: quizForm.quizTitle,
        course: currentCourse._id,
        section: quizForm.section,
        instructions: quizForm.instructions,
        timeLimit: quizForm.timeLimit || 60,
        questions: quizForm.questions.map(q => ({
          question: q.question,
          options: q.options,
          answer: q.answer,
          marks: parseInt(q.marks) || 1
        }))
      };

      console.log("Submitting quiz data:", quizData);

      // Send quiz to backend
      const response = await axios.post(`${API_BASE_URL}/api/quizzes/add`, quizData);
      
      if (response.status === 201) {
        alert(`Quiz added successfully! Total marks: ${calculateTotalMarks()}`);
        
        // Reset form
        setQuizForm({
          quizTitle: "",
          section: "",
          instructions: "",
          timeLimit: 60,
          questions: [],
        });
        
        // Refresh course data to show the new quiz
        await fetchCourses();
        
        setActiveSubForm("basic");
      }
    } catch (error) {
      console.error("Quiz submission error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to add quiz.";
      setQuizFormError(errorMessage);
    }
  };

  // Render Basic Information Form
  const renderBasicForm = () => (
    <form onSubmit={handleBasicFormSubmit}>
      <h5>Basic Information</h5>
      <div className="row mb-3">
        <div className="col-md-6">
          <label>Course Title</label>
          <input 
            type="text" 
            className="form-control" 
            name="title"
            placeholder="Enter course title" 
            required
          />
        </div>
        <div className="col-md-6">
          <label>Category</label>
          <input 
            type="text" 
            className="form-control" 
            name="category"
            placeholder="Enter or create a category" 
            required
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-12">
          <label>Description</label>
          <textarea 
            className="form-control" 
            rows="4" 
            name="description"
            placeholder="Enter course description"
            required
          ></textarea>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label>Level</label>
          <select className="form-control" name="level" required>
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">Next: Add Sections</button>
    </form>
  );

  // Render Add Section Form
  const renderAddSectionForm = () => (
    <div>
      <h5>Add New Section</h5>
      <form onSubmit={handleSectionFormSubmit}>
        <div className="mb-3">
          <label>Course Title</label>
          <select className="form-control" name="course" required>
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Section Title</label>
          <input 
            type="text" 
            className="form-control" 
            name="sectionTitle"
            placeholder="Enter section title" 
            required
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Add Section</button>
          <button 
            type="button" 
            className="btn btn-success"
            onClick={() => setActiveSubForm("lesson")} // Ensure this transitions to the "Add Lesson" form
          >
            Next: Add Lessons
          </button>
        </div>
      </form>
      
      {/* Display added sections */}
      {sections.length > 0 && (
        <div className="mt-4">
          <h6>Added Sections:</h6>
          <ul className="list-group">
            {sections.map((section, index) => (
              <li key={index} className="list-group-item">
                {section.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // Helper to fetch sections for a selected course (used in lesson form)
  const fetchSectionsForCourse = async (courseId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/courses/sections/${courseId}`);
      return res.data.sections || [];
    } catch {
      return [];
    }
  };

  // Handler for course dropdown change in lesson form
  const handleLessonCourseChange = async (e) => {
    const courseId = e.target.value;
    setLessonCourseId(courseId);
    if (courseId) {
      const sections = await fetchSectionsForCourse(courseId);
      setLessonSections(sections);
    } else {
      setLessonSections([]);
    }
  };

  // Render Add Lesson Form
  const renderAddLessonForm = () => (
    <div>
      <h5>Add New Lesson</h5>
      {lessonFormError && (
        <div className="alert alert-danger">{lessonFormError}</div>
      )}
      <form onSubmit={handleLessonFormSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Choose Course</label>
            <select
              className="form-control"
              name="lessonCourse"
              required
              value={lessonCourseId}
              onChange={handleLessonCourseChange}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label>Select Section</label>
            <select
              className="form-control"
              name="section"
              required
              value={selectedSection ? selectedSection : ""}
              onChange={e => setSelectedSection(e.target.value)}
              disabled={!lessonCourseId}
            >
              <option value="">Select Section</option>
              {lessonSections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label>Lesson Title</label>
          <input
            type="text"
            className="form-control"
            name="lessonTitle"
            placeholder="Enter lesson title"
            required
          />
        </div>
        <div className="mb-3">
          <label>Lesson Type</label>
          <select className="form-control" name="lessonType" required>
            <option value="">Select Lesson Type</option>
            <option value="Video">Video</option>
            <option value="Text">Text</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Text</label>
          <textarea
            className="form-control"
            rows="3"
            name="summary"
            placeholder="Enter lesson summary"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label>Video URL (Google Drive or YouTube, only for Video lessons)</label>
          <input
            type="url"
            className="form-control"
            name="videoUrl"
            placeholder="Paste Google Drive or YouTube video link here"
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Add Lesson
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => setActiveSubForm("quiz")}
          >
            Next: Add Quizzes
          </button>
        </div>
      </form>
    </div>
  );

  // Render Add Quiz Form
  const renderAddQuizForm = () => (
    <div>
      <h5>Add New Quiz</h5>
      {quizFormError && (
        <div className="alert alert-danger">{quizFormError}</div>
      )}
      <form onSubmit={handleQuizFormSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Choose Course</label>
            <select
              className="form-control"
              value={selectedCourseId}
              onChange={async (e) => {
                setSelectedCourseId(e.target.value);
                if (e.target.value) {
                  const sections = await fetchSectionsForCourse(e.target.value);
                  setAvailableSections(sections);
                  setQuizForm((prev) => ({ ...prev, section: "" }));
                } else {
                  setAvailableSections([]);
                  setQuizForm((prev) => ({ ...prev, section: "" }));
                }
              }}
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label>Select Section</label>
            <select
              className="form-control"
              name="section"
              value={quizForm.section}
              onChange={handleQuizInputChange}
              required
              disabled={!selectedCourseId}
            >
              <option value="">Select Section</option>
              {availableSections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label>Quiz Title</label>
          <input
            type="text"
            className="form-control"
            name="quizTitle"
            value={quizForm.quizTitle}
            onChange={handleQuizInputChange}
            placeholder="Enter quiz title"
            required
          />
        </div>
        <div className="mb-3">
          <label>Instructions</label>
          <textarea
            className="form-control"
            rows="3"
            name="instructions"
            value={quizForm.instructions}
            onChange={handleQuizInputChange}
            placeholder="Enter quiz instructions"
          ></textarea>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Time Limit (minutes)</label>
            <input
              type="number"
              className="form-control"
              name="timeLimit"
              value={quizForm.timeLimit}
              onChange={handleQuizInputChange}
              placeholder="Enter time limit in minutes"
              min="1"
              required
            />
          </div>
          <div className="col-md-6">
            <label>Total Marks</label>
            <div className="form-control bg-light">
              <strong>{calculateTotalMarks()} marks</strong>
            </div>
          </div>
        </div>
        <div>
          <h6>Questions</h6>
          {quizForm.questions.map((q, idx) => (
            <div key={idx} className="border rounded p-3 mb-3">
              <div className="mb-2">
                <label>Question {idx + 1}</label>
                <input
                  type="text"
                  className="form-control"
                  value={q.question}
                  onChange={(e) => handleQuizInputChange(e, idx, "question")}
                  placeholder="Enter question"
                  required
                />
              </div>
              <div className="mb-2">
                <label>Options</label>
                {q.options.map((opt, optIdx) => (
                  <input
                    key={optIdx}
                    type="text"
                    className="form-control mb-1"
                    value={opt}
                    onChange={(e) =>
                      handleQuizInputChange(e, idx, "options", optIdx)
                    }
                    placeholder={`Option ${optIdx + 1}`}
                    required
                  />
                ))}
              </div>
              <div className="mb-2">
                <label>Correct Option</label>
                <select
                  className="form-control"
                  value={q.answer}
                  onChange={(e) => handleQuizInputChange(e, idx, "answer")}
                  required
                >
                  <option value="">Select correct option</option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                  <option value="3">Option 3</option>
                  <option value="4">Option 4</option>
                </select>
              </div>
              <div className="mb-2">
                <label>Marks</label>
                <input
                  type="number"
                  className="form-control"
                  value={q.marks || ""}
                  min="1"
                  onChange={(e) => handleQuizInputChange(e, idx, "marks")}
                  placeholder="Enter marks for this question"
                  required
                />
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveQuestion(idx)}
              >
                Remove Question
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>
        </div>
        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-primary">
            Add Quiz
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              setShowAddCourseForm(false);
              setActiveSubForm("basic");
              setCurrentCourse({});
              setSections([]);
              setLessons([]);
              setQuizzes([]);
            }}
          >
            Complete Course
          </button>
        </div>
      </form>
    </div>
  );

  // Render Quiz Details Page
  const renderQuizPage = () => {
    if (!selectedQuiz) return null;
    return (
      <div className="quiz-page">
        <button className="btn btn-secondary mb-3" onClick={() => setSelectedQuiz(null)}>
          &larr; Back to Section
        </button>
        <h3>{selectedQuiz.title}</h3>
        <div className="mb-2"><strong>Instructions:</strong> {selectedQuiz.instructions}</div>
        <div>
          <strong>Questions:</strong>
          <ol>
            {(selectedQuiz.questions || []).map((q, idx) => (
              <li key={idx} className="mb-3">
                <div>
                  <span className="fw-bold">{q.question}</span>
                  <span className="badge bg-secondary ms-2">Marks: {q.marks}</span>
                </div>
                <ul>
                  {(q.options || []).map((opt, optIdx) => (
                    <li key={optIdx} style={{ color: (String(optIdx + 1) === q.answer) ? "#198754" : undefined }}>
                      {opt}
                      {String(optIdx + 1) === q.answer && (
                        <span className="badge bg-success ms-2">Correct</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  };

  const renderLessonsList = () => {
    if (!selectedSection) return null;
    return (
      <div>
        <button className="btn btn-secondary mb-3" onClick={() => setSelectedSection(null)}>
          &larr; Back to Sections
        </button>
        <h5>Lessons in "{selectedSection.title}"</h5>
        <ul className="list-group">
          {(selectedSection.lessons || []).map((lesson, idx) => (
            <li
              key={lesson._id}
              className="list-group-item d-flex justify-content-between align-items-start"
              style={{ cursor: "pointer" }}
              onClick={() => handleLessonClick(lesson)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="d-flex align-items-center mb-1">
                  <strong>
                    {lesson.title}
                  </strong>
                  <span className="badge bg-info ms-2">{lesson.type}</span>
                  <span className={`badge ms-2 ${lesson.enabled ? "bg-success" : "bg-warning"}`}>
                    {lesson.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div
                  className="text-muted"
                  style={{
                    maxWidth: 700,
                    whiteSpace: "pre-line",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordBreak: "break-word",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    padding: "8px",
                    background: "#f8f9fa",
                    marginBottom: 0,
                    maxHeight: 80, // boundary for text
                    display: "block"
                  }}
                >
                  {lesson.summary}
                </div>
              </div>
              <div className="d-flex flex-column align-items-end ms-3">
                <button
                  className="btn btn-secondary btn-sm mb-2"
                  onClick={e => {
                    e.stopPropagation();
                    setEditLesson(lesson);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm mb-2"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteLesson(selectedCourse._id, selectedSection._id, lesson._id);
                  }}
                >
                  Delete Lesson
                </button>
                <button
                  className={`btn btn-sm mb-2 ${lesson.enabled ? "btn-warning" : "btn-success"}`}
                  onClick={e => {
                    e.stopPropagation();
                    handleToggleLessonEnabled(selectedCourse._id, selectedSection._id, lesson._id, lesson.enabled);
                  }}
                >
                  {lesson.enabled ? "Disable" : "Enable"}
                </button>
                {lesson.type === "Video" ? (
                  <i className="fas fa-play-circle"></i>
                ) : (
                  <i className="fas fa-file-alt"></i>
                )}
              </div>
            </li>
          ))}
        </ul>
        {/* Render quizzes for this section */}
        <div className="mt-4">
          <h5>Quizzes in "{selectedSection.title}"</h5>
          <ul className="list-group">
            {(selectedSection.quizzes || []).map((quiz) => (
              <li
                key={quiz._id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedQuiz(quiz)}
              >
                <div>
                  <strong>{quiz.title}</strong>
                  <span className={`badge ms-2 ${quiz.enabled ? "bg-success" : "bg-warning"}`}>
                    {quiz.enabled ? "Enabled" : "Disabled"}
                  </span>
                  <div className="text-muted">{quiz.instructions}</div>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={e => {
                      e.stopPropagation();
                      setEditQuiz(quiz);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteQuiz(selectedCourse._id, selectedSection._id, quiz._id);
                    }}
                  >
                    Delete Quiz
                  </button>
                  <button
                    className={`btn btn-sm me-2 ${quiz.enabled ? "btn-warning" : "btn-success"}`}
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleQuizEnabled(selectedCourse._id, selectedSection._id, quiz._id, quiz.enabled);
                    }}
                  >
                    {quiz.enabled ? "Disable" : "Enable"}
                  </button>
                  <span className="ms-2 text-primary" style={{ fontSize: "1.2em" }}>
                    <i className="fas fa-eye"></i>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderCourseList = () => (
    <div>
      <div className="course-categories mb-4">
        <h5>Course Categories</h5>
        <div className="d-flex gap-3">
          <button className="btn btn-primary" onClick={() => setCoursesFilter("All")}>
            All
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              className="btn btn-outline-primary"
              onClick={() => setCoursesFilter(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Course List */}
      <div className="row">
        {courses
          .filter((course) => coursesFilter === "All" || course.category === coursesFilter)
          .map((course) => (
            <div className="col-md-4 mb-4" key={course._id}>
              <div className="card course-card" onClick={() => handleCourseClick(course)}>
                <img src={course.image || createCoursePlaceholder(300, 200)} className="card-img-top" alt={course.title} />
                <div className="card-body">
                  <span className={`badge bg-primary mb-2`}>{course.category}</span>
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <ul className="list-unstyled">
                    <li>
                      <i className="fas fa-clock me-2"></i>Level: {course.level}
                    </li>
                    <li>
                      <i className="fas fa-book me-2"></i>{(course.sections || []).length} sections
                    </li>
                  </ul>
                  <button
                    className="btn btn-danger btn-sm mt-2 me-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course._id);
                    }}
                  >
                    Delete Course
                  </button>
                  <button
                    className={`btn btn-sm mt-2 ${course.enabled ? "btn-warning" : "btn-success"}`}
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleCourseEnabled(course._id, course.enabled);
                    }}
                  >
                    {course.enabled ? "Disable" : "Enable"}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm mt-2 ms-2 me-2"
                    onClick={e => {
                      e.stopPropagation();
                      setEditCourse(course);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // Handle Course Click: Show sections for the selected course
  const handleCourseClick = (course) => {
    // Navigate to the dedicated course details page
    navigate(`/courses/${course._id}`);
  };

  // Handle Section Click: Show lessons for the selected section
  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setSelectedLesson(null);
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const getEmbedUrl = (videoUrl) => {
    if (!videoUrl) return null;
    if (videoUrl.includes("drive.google.com")) {
      const match = videoUrl.match(/\/file\/d\/([^/]+)\//);
      if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    if (videoUrl.includes("youtube.com/watch?v=")) {
      const id = videoUrl.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (videoUrl.includes("youtu.be/")) {
      const id = videoUrl.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return videoUrl;
  };

  // Render Lesson Page
  const renderLessonPage = () => {
    if (!selectedLesson) return null;
    const embedUrl = getEmbedUrl(selectedLesson.videoUrl);
    return (
      <div className="lesson-page">
        <button className="btn btn-secondary mb-3" onClick={() => setSelectedLesson(null)}>
          &larr; Back to Lessons
        </button>
        <h3>{selectedLesson.title}</h3>
        <p>{selectedLesson.summary}</p>
        {selectedLesson.type === "Video" && embedUrl ? (
          <div className="video-responsive mb-3" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              src={embedUrl}
              title={selectedLesson.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          </div>
        ) : (
          <div className="alert alert-info">No video available for this lesson.</div>
        )}
        <div>
          <strong>Type:</strong> {selectedLesson.type}
        </div>
        {/* Add more lesson details as needed */}
      </div>
    );
  };

  // Fix: Render Sections List for a Course (was missing in your last code)
  const renderSectionsList = () => {
    if (!selectedCourse) return null;
    return (
      <div>
        <button className="btn btn-secondary mb-3" onClick={() => setShowCourseDetails(false)}>
          &larr; Back to Courses
        </button>
        <h4>{selectedCourse.title}</h4>
        <p>{selectedCourse.description}</p>
        <h5>Sections</h5>
        <ul className="list-group">
          {(selectedCourse.sections || []).map((section) => (
            <li
              key={section._id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleSectionClick(section)}
            >
              <div>
                <strong>{section.title}</strong>
                <span className="badge bg-primary ms-2">
                  {section.lessons?.length || 0} Lessons
                </span>
                <span className="badge bg-secondary ms-2">
                  {section.quizzes?.length || 0} Quizzes
                </span>
                <span className={`badge ms-2 ${section.enabled ? "bg-success" : "bg-warning"}`}>
                  {section.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSection(selectedCourse._id, section._id);
                  }}
                >
                  Delete Section
                </button>
                <button
                  className={`btn btn-sm me-2 ${section.enabled ? "btn-warning" : "btn-success"}`}
                  onClick={e => {
                    e.stopPropagation();
                    handleToggleSectionEnabled(selectedCourse._id, section._id, section.enabled);
                  }}
                >
                  {section.enabled ? "Disable" : "Enable"}
                </button>
                <button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={e => {
                    e.stopPropagation();
                    setEditSection(section);
                  }}
                >
                  Edit
                </button>
                <i className="fas fa-chevron-right"></i>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Fix: Add missing handler functions for delete/toggle
  const handleDeleteSection = async (courseId, sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/courses/delete-section/${courseId}/${sectionId}`);
      window.location.reload();
    } catch (error) {
      alert("Failed to delete section: " + (error.response?.data?.message || error.message));
    }
  };

  const handleToggleSectionEnabled = async (courseId, sectionId, currentEnabled) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/courses/toggle-section-enabled/${courseId}/${sectionId}`, { enabled: !currentEnabled });
      window.location.reload();
    } catch (error) {
      alert("Failed to toggle section: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteLesson = async (courseId, sectionId, lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/courses/delete-lesson/${courseId}/${sectionId}/${lessonId}`);
      window.location.reload();
    } catch (error) {
      alert("Failed to delete lesson: " + (error.response?.data?.message || error.message));
    }
  };

  const handleToggleLessonEnabled = async (courseId, sectionId, lessonId, currentEnabled) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/courses/toggle-lesson-enabled/${courseId}/${sectionId}/${lessonId}`, { enabled: !currentEnabled });
      window.location.reload();
    } catch (error) {
      alert("Failed to toggle lesson: " + (error.response?.data?.message || error.message));
    }
  };

  const handleToggleCourseEnabled = async (courseId, currentEnabled) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/courses/toggle-enabled/${courseId}`, { enabled: !currentEnabled });
      window.location.reload();
    } catch (error) {
      alert("Failed to toggle course: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/courses/delete/${courseId}`);
      window.location.reload();
    } catch (error) {
      alert("Failed to delete course: " + (error.response?.data?.message || error.message));
    }
  };

  // Add handler for toggling quiz enabled/disabled
  const handleToggleQuizEnabled = async (courseId, sectionId, quizId, currentEnabled) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/courses/toggle-quiz-enabled/${courseId}/${sectionId}/${quizId}`, { enabled: !currentEnabled });
      window.location.reload();
    } catch (error) {
      alert("Failed to toggle quiz: " + (error.response?.data?.message || error.message));
    }
  };

  // Add handler for deleting a quiz
  const handleDeleteQuiz = async (courseId, sectionId, quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      // Remove quiz from section (custom endpoint required in backend)
      await axios.delete(`${API_BASE_URL}/api/courses/delete-quiz/${courseId}/${sectionId}/${quizId}`);
      window.location.reload();
    } catch (error) {
      alert("Failed to delete quiz: " + (error.response?.data?.message || error.message));
    }
  };

  // Fix: Make sure renderCourseDetails uses renderSectionsList
  const renderCourseDetails = () => renderSectionsList();

  // Edit Course Form
  function EditCourseForm({ editCourse, setEditCourse }) {
    const [form, setForm] = React.useState({
      title: editCourse.title,
      category: editCourse.category,
      description: editCourse.description,
      level: editCourse.level,
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async e => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        await axios.put(`${API_BASE_URL}/api/courses/update/${editCourse._id}`, form);
        setEditCourse(null);
        window.location.reload();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    return (
      <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="modal-dialog"><div className="modal-content">
          <div className="modal-header"><h5>Edit Course</h5>
            <button type="button" className="btn-close" onClick={() => setEditCourse(null)}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <input className="form-control mb-2" name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
              <input className="form-control mb-2" name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
              <textarea className="form-control mb-2" name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
              <select className="form-control mb-2" name="level" value={form.level} onChange={handleChange} required>
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
              <button className="btn btn-secondary" type="button" onClick={() => setEditCourse(null)}>Cancel</button>
            </div>
          </form>
        </div></div>
      </div>
    );
  }

  // Edit Section Form
  function EditSectionForm({ editSection, setEditSection, selectedCourse }) {
    const [form, setForm] = React.useState({ title: editSection.title });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async e => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        await axios.put(`${API_BASE_URL}/api/courses/update/${selectedCourse._id}`, {
          sections: selectedCourse.sections.map(s =>
            s._id === editSection._id ? { ...s, title: form.title } : s
          ),
        });
        setEditSection(null);
        window.location.reload();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    return (
      <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="modal-dialog"><div className="modal-content">
          <div className="modal-header"><h5>Edit Section</h5>
            <button type="button" className="btn-close" onClick={() => setEditSection(null)}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <input className="form-control mb-2" name="title" value={form.title} onChange={handleChange} placeholder="Section Title" required />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
              <button className="btn btn-secondary" type="button" onClick={() => setEditSection(null)}>Cancel</button>
            </div>
          </form>
        </div></div>
      </div>
    );
  }

  // Edit Lesson Form
  function EditLessonForm({ editLesson, setEditLesson, selectedCourse, selectedSection }) {
    const [form, setForm] = React.useState({
      title: editLesson.title,
      type: editLesson.type,
      summary: editLesson.summary,
      videoUrl: editLesson.videoUrl || "",
      enabled: editLesson.enabled,
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async e => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        // Backend: update lesson in section (see backend code below)
        await axios.put(`${API_BASE_URL}/api/courses/update-lesson/${selectedCourse._id}/${selectedSection._id}/${editLesson._id}`, form);
        setEditLesson(null);
        window.location.reload();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    return (
      <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="modal-dialog"><div className="modal-content">
          <div className="modal-header"><h5>Edit Lesson</h5>
            <button type="button" className="btn-close" onClick={() => setEditLesson(null)}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <input className="form-control mb-2" name="title" value={form.title} onChange={handleChange} placeholder="Lesson Title" required />
              <select className="form-control mb-2" name="type" value={form.type} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="Video">Video</option>
                <option value="Text">Text</option>
              </select>
              <textarea className="form-control mb-2" name="summary" value={form.summary} onChange={handleChange} placeholder="Summary" required />
              {form.type === "Video" && (
                <input className="form-control mb-2" name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="Video URL" required />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
              <button className="btn btn-secondary" type="button" onClick={() => setEditLesson(null)}>Cancel</button>
            </div>
          </form>
        </div></div>
      </div>
    );
  }

  // Edit Quiz Form (edit title, instructions, questions, options, correct answer)
  function EditQuizForm({ editQuiz, setEditQuiz, selectedCourse, selectedSection }) {
    const [form, setForm] = React.useState({
      title: editQuiz.title,
      instructions: editQuiz.instructions,
      questions: editQuiz.questions.map(q => ({ ...q })),
      enabled: editQuiz.enabled,
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleQuestionChange = (idx, field, value) => {
      setForm(prev => ({
        ...prev,
        questions: prev.questions.map((q, i) =>
          i === idx ? { ...q, [field]: value } : q
        ),
      }));
    };
    const handleOptionChange = (qIdx, optIdx, value) => {
      setForm(prev => ({
        ...prev,
        questions: prev.questions.map((q, i) =>
          i === qIdx
            ? { ...q, options: q.options.map((opt, oi) => (oi === optIdx ? value : opt)) }
            : q
        ),
      }));
    };
    const handleSubmit = async e => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        // Backend: update quiz in section (see backend code below)
        await axios.put(`${API_BASE_URL}/api/courses/update-quiz/${selectedCourse._id}/${selectedSection._id}/${editQuiz._id}`, form);
        setEditQuiz(null);
        window.location.reload();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    return (
      <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="modal-dialog modal-lg"><div className="modal-content">
          <div className="modal-header"><h5>Edit Quiz</h5>
            <button type="button" className="btn-close" onClick={() => setEditQuiz(null)}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <input className="form-control mb-2" name="title" value={form.title} onChange={handleChange} placeholder="Quiz Title" required />
              <textarea className="form-control mb-2" name="instructions" value={form.instructions} onChange={handleChange} placeholder="Instructions" required />
              {form.questions.map((q, idx) => (
                <div key={idx} className="border rounded p-2 mb-2">
                  <input className="form-control mb-1" value={q.question} onChange={e => handleQuestionChange(idx, "question", e.target.value)} placeholder={`Question ${idx + 1}`} required />
                  {q.options.map((opt, optIdx) => (
                    <input key={optIdx} className="form-control mb-1" value={opt} onChange={e => handleOptionChange(idx, optIdx, e.target.value)} placeholder={`Option ${optIdx + 1}`} required />
                  ))}
                  <select className="form-control mb-1" value={q.answer} onChange={e => handleQuestionChange(idx, "answer", e.target.value)} required>
                    <option value="">Correct Option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                    <option value="4">Option 4</option>
                  </select>
                  <input className="form-control mb-1" type="number" value={q.marks || ""} min="1" onChange={e => handleQuestionChange(idx, "marks", e.target.value)} placeholder="Marks" required />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
              <button className="btn btn-secondary" type="button" onClick={() => setEditQuiz(null)}>Cancel</button>
            </div>
          </form>
        </div></div>
      </div>
    );
  }

  return (
    <div className="courses-container m-0">
      {/* Stat Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card bg-primary text-white">
            <h5>Total Courses</h5>
            <h3>{statistics.totalCourses}</h3>
            <p>All Programs</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-success text-white">
            <h5>Active Courses</h5>
            <h3>{statistics.activeCourses}</h3>
            <p>Currently Enabled</p>
          </div>
        </div>
      </div>
      <div className="course-header d-flex justify-content-between align-items-center mb-4">
        <h4>Available Courses</h4>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowAddModal(true)}
        >
          Add Course
        </button>
      </div>
      <div className="course-categories mb-4">
        <h5>Course Categories</h5>
        <div className="d-flex gap-3">
          <button className="btn btn-primary" onClick={() => setCoursesFilter("All")}>All</button>
          {categories.map((category) => (
            <button
              key={category._id}
              className="btn btn-outline-primary"
              onClick={() => setCoursesFilter(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div className="row">
        {courses
          .filter((course) => coursesFilter === "All" || course.category === coursesFilter)
          .map((course) => (
            <div className="col-md-4 mb-4" key={course._id}>
              <div className="card course-card" onClick={() => handleCourseClick(course)}>
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <span className={`badge bg-primary mb-2`}>{course.category}</span>
                  <p className="card-text">{course.description}</p>
                  <ul className="list-unstyled">
                    <li>
                      <i className="fas fa-clock me-2"></i>Level: {course.level}
                    </li>
                    <li>
                      <i className="fas fa-book me-2"></i>{(course.sections || []).length} sections
                    </li>
                    <li>
                      <span className={`badge ${course.status === "Paid" ? "bg-danger" : "bg-info"} me-2`}>
                        {course.status === "Paid" ? `Paid - ₹${course.amount}` : "Free"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Add Course Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="modal-dialog modal-lg"><div className="modal-content">
            <div className="modal-header"><h5>Add New Course</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
            </div>
            <form onSubmit={handleAddCourse} encType="multipart/form-data">
              <div className="modal-body">
                {addError && <div className="alert alert-danger">{addError}</div>}
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input className="form-control mb-2" name="title" value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} placeholder="Course Title" required />
                    <label className="form-label">Category</label>
                    <select className="form-control mb-2" name="category" value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))} required>
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                      <option value="__add_new__">+ Add New Category</option>
                    </select>
                    {addForm.category === "__add_new__" && (
                      <div className="input-group mb-2">
                        <input className="form-control" placeholder="New Category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                        <button className="btn btn-outline-secondary" type="button" onClick={async () => {
                          if (!newCategory.trim()) return;
                          try {
                            const res = await axios.post(`${API_BASE_URL}/api/categories/add`, { name: newCategory });
                            setCategories([...categories, res.data]);
                            setAddForm(f => ({ ...f, category: newCategory }));
                            setNewCategory("");
                          } catch (err) {
                            alert("Failed to add category");
                          }
                        }}>Add</button>
                      </div>
                    )}
                    <label className="form-label">Level</label>
                    <select className="form-control mb-2" name="level" value={addForm.level} onChange={e => setAddForm(f => ({ ...f, level: e.target.value }))} required>
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <label className="form-label">Status</label>
                    <select className="form-control mb-2" name="status" value={addForm.status} onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))} required>
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                    {addForm.status === "Paid" && (
                      <>
                        <label className="form-label">Price (₹)</label>
                        <input type="number" className="form-control mb-2" name="price" value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))} placeholder="Course Price" min="0" required />
                      </>
                    )}
                    <label className="form-label">Estimated Duration</label>
                    <input className="form-control mb-2" name="estimatedDuration" value={addForm.estimatedDuration} onChange={e => setAddForm(f => ({ ...f, estimatedDuration: e.target.value }))} placeholder="e.g. 10 hours" />
                    
                    <div className="mb-3">
                      <ImageUpload
                        currentImage={addForm.image}
                        onImageChange={(image) => setAddForm(f => ({ ...f, image }))}
                        label="Course Image"
                        className="mb-3"
                      />
                    </div>
                    
                    <label className="form-label">Enabled</label>
                    <div className="form-check form-switch mb-2">
                      <input className="form-check-input" type="checkbox" checked={addForm.enabled} onChange={e => setAddForm(f => ({ ...f, enabled: e.target.checked }))} />
                      <label className="form-check-label">{addForm.enabled ? "Enabled" : "Disabled"}</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Description</label>
                    <textarea className="form-control mb-2" name="description" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} placeholder="Course Description" rows={5} required />
                    <label className="form-label">Prerequisites</label>
                    <textarea className="form-control mb-2" name="prerequisites" value={addForm.prerequisites} onChange={e => setAddForm(f => ({ ...f, prerequisites: e.target.value }))} placeholder="Recommended prerequisites" rows={3} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" type="submit" disabled={addLoading}>{addLoading ? "Saving..." : "Save"}</button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div></div>
        </div>
      )}
    </div>
  );
}

export default Courses;