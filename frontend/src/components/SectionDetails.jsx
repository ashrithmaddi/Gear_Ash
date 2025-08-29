import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://gearash-production.up.railway.app";

function SectionDetails() {
  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [addLessonForm, setAddLessonForm] = useState({
    title: "",
    type: "",
    description: "",
    textContent: "",
    videoUrl: "",
    imageUrl: "",
    fileUrl: ""
  });
  const [addLessonError, setAddLessonError] = useState("");
  const [addLessonLoading, setAddLessonLoading] = useState(false);
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [addQuizForm, setAddQuizForm] = useState({
    title: "",
    instructions: "",
    questions: []
  });
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: { A: "", B: "" }, // Start with minimum 2 options
    correctAnswer: "A",
    marks: 1
  });
  const [addQuizError, setAddQuizError] = useState("");
  const [addQuizLoading, setAddQuizLoading] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Helper function to calculate total marks
  const calculateTotalMarks = (questions) => {
    return questions.reduce((total, q) => {
      const marks = typeof q.marks === 'number' ? q.marks : parseInt(q.marks) || 0;
      return total + marks;
    }, 0);
  };

  useEffect(() => {
    const fetchSectionAndQuizzes = async () => {
      setLoading(true);
      try {
        // Fetch course and section data
        const courseRes = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
        setCourse(courseRes.data.course || courseRes.data);
        const foundSection = (courseRes.data.course || courseRes.data).sections.find(s => s._id === sectionId);
        setSection(foundSection);

        // Fetch quizzes for this section
        const quizzesRes = await axios.get(`${API_BASE_URL}/api/quizzes/section/${sectionId}`);
        setQuizzes(quizzesRes.data || []);
        
        setError("");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch section details or quizzes.");
      } finally {
        setLoading(false);
      }
    };
    fetchSectionAndQuizzes();
  }, [courseId, sectionId]);

  const handleDeleteSection = async () => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/courses/delete-section/${courseId}/${sectionId}`);
      navigate(`/courses/${courseId}`);
    } catch (err) {
      alert("Failed to delete section: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleSectionEnabled = async () => {
    try {
      await axios.patch(`${API_BASE_URL}/api/courses/toggle-section-enabled/${courseId}/${sectionId}`, { enabled: !section.enabled });
      setSection({ ...section, enabled: !section.enabled });
    } catch (err) {
      alert("Failed to toggle section: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setAddLessonLoading(true);
    setAddLessonError("");
    try {
      // Prepare lesson payload based on type
      const payload = {
        title: addLessonForm.title,
        type: addLessonForm.type,
        description: addLessonForm.description,
      };
      if (addLessonForm.type === "Text") {
        payload.textContent = addLessonForm.textContent;
      }
      if (addLessonForm.type === "Video") {
        payload.videoUrl = addLessonForm.videoUrl;
      }
      if (addLessonForm.type === "Image") {
        payload.imageUrl = addLessonForm.imageUrl;
      }
      if (
        ["PDF", "Document", "Excel"].includes(addLessonForm.type)
      ) {
        payload.fileUrl = addLessonForm.fileUrl;
      }
      await axios.put(
        `${API_BASE_URL}/api/courses/add-lesson/${courseId}/${sectionId}`,
        payload
      );
      // Refetch section
      const res = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
      const foundSection = (res.data.course || res.data).sections.find(
        (s) => s._id === sectionId
      );
      setSection(foundSection);
      setShowAddLessonModal(false);
      setAddLessonForm({
        title: "",
        type: "",
        description: "",
        textContent: "",
        videoUrl: "",
        imageUrl: "",
        fileUrl: ""
      });
    } catch (err) {
      setAddLessonError(err.response?.data?.message || err.message);
    } finally {
      setAddLessonLoading(false);
    }
  };
  const handleQuizInputChange = (e) => {
    const { name, value } = e.target;
    // Convert marks to number, keep other fields as strings
    const processedValue = name === 'marks' ? parseInt(value) || 1 : value;
    setNewQuestion(q => ({ ...q, [name]: processedValue }));
  };

  const handleOptionChange = (key, value) => {
    setNewQuestion(q => ({
      ...q,
      options: { ...q.options, [key]: value }
    }));
  };

  const handleAddOption = () => {
    setNewQuestion(q => {
      const nextKey = String.fromCharCode(65 + Object.keys(q.options).length); // "A", "B", "C", ...
      return { ...q, options: { ...q.options, [nextKey]: "" } };
    });
  };

  const handleRemoveOption = (key) => {
    setNewQuestion(q => {
      const opts = { ...q.options };
      delete opts[key];
      return { ...q, options: opts };
    });
  };

  const handleAddQuestion = () => {
    if (
      !newQuestion.question ||
      Object.keys(newQuestion.options).length < 2 ||
      Object.values(newQuestion.options).some(opt => !opt.trim()) ||
      !newQuestion.correctAnswer ||
      !Object.keys(newQuestion.options).includes(newQuestion.correctAnswer) ||
      !newQuestion.marks ||
      newQuestion.marks <= 0
    ) return;

    // Ensure marks is stored as a number
    const questionToAdd = {
      ...newQuestion,
      marks: typeof newQuestion.marks === 'number' ? newQuestion.marks : parseInt(newQuestion.marks) || 1
    };
    
    setAddQuizForm(f => ({
      ...f,
      questions: [...f.questions, questionToAdd]
    }));
    setNewQuestion({ question: "", options: { A: "", B: "" }, correctAnswer: "A", marks: 1 });
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    setAddQuizLoading(true);
    setAddQuizError("");
    
    // Validate form data
    if (!addQuizForm.title.trim()) {
      setAddQuizError("Quiz title is required.");
      setAddQuizLoading(false);
      return;
    }
    
    if (addQuizForm.questions.length === 0) {
      setAddQuizError("At least one question is required.");
      setAddQuizLoading(false);
      return;
    }
    
    try {
      // Prepare quiz data with proper structure
      const quizData = {
        title: addQuizForm.title,
        course: courseId,
        section: sectionId,
        instructions: addQuizForm.instructions,
        questions: addQuizForm.questions.map(q => ({
          question: q.question,
          options: Object.values(q.options), // Convert {A: "opt1", B: "opt2"} to ["opt1", "opt2"]
          answer: Object.keys(q.options).indexOf(q.correctAnswer) + 1, // Convert A,B,C,D to 1,2,3,4
          marks: parseInt(q.marks) || 1
        }))
      };

      console.log("Submitting quiz data:", quizData);

      await axios.post(`${API_BASE_URL}/api/quizzes/add`, quizData);
      
      // Refetch quizzes to show the new one
      const quizzesRes = await axios.get(`${API_BASE_URL}/api/quizzes/section/${sectionId}`);
      setQuizzes(quizzesRes.data || []);
      
      setShowAddQuizModal(false);
      setAddQuizForm({ title: "", instructions: "", questions: [] });
      
      const totalMarks = quizData.questions.reduce((total, q) => total + q.marks, 0);
      alert(`Quiz added successfully! Total marks: ${totalMarks}`);
    } catch (err) {
      console.error("Quiz submission error:", err);
      setAddQuizError(err.response?.data?.message || err.message);
    } finally {
      setAddQuizLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!section) return <div>No section found.</div>;

  return (
    <div className="container my-4">
      {/* Go Back Button */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Course
        </button>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>{section.title}</h2>
          {section.description && (
            <p className="text-muted mb-2">{section.description}</p>
          )}
          <span className={`badge ${section.enabled ? "bg-success" : "bg-warning"}`}>{section.enabled ? "Enabled" : "Disabled"}</span>
        </div>
        <div className="dropdown">
          <button className="btn btn-outline-secondary dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
            Settings
          </button>
          {showDropdown && (
            <ul className="dropdown-menu show" style={{ position: "absolute", right: 0 }}>
              <li><button className="dropdown-item" onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/edit`)}>Edit Section</button></li>
              <li><button className="dropdown-item" onClick={handleToggleSectionEnabled}>{section.enabled ? "Disable" : "Enable"} Section</button></li>
              <li><button className="dropdown-item" onClick={() => setShowAddLessonModal(true)}>Add Lesson</button></li>
              <li><button className="dropdown-item" onClick={() => {
                setShowAddQuizModal(true);
                // Reset form when opening modal
                setAddQuizForm({ title: "", instructions: "", questions: [] });
                setNewQuestion({ question: "", options: { A: "", B: "", C: "", D: "" }, correctAnswer: "A", marks: 1 });
                setAddQuizError("");
              }}>Add Quiz</button></li>
              <li><button className="dropdown-item text-danger" onClick={handleDeleteSection}>Delete Section</button></li>
            </ul>
          )}
        </div>
      </div>
      <div className="mb-4">
        <h4>Lessons</h4>
        {(!section.lessons || section.lessons.length === 0) ? (
          <div>No lessons added yet.</div>
        ) : (
          <ul className="list-group">
            {section.lessons.map(lesson => (
              <li
                key={lesson._id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/lessons/${lesson._id}`)}
              >
                <div>
                  <strong>{lesson.title}</strong>
                  <span className="badge bg-info ms-2">{lesson.type}</span>
                  <span className={`badge ms-2 ${lesson.enabled ? "bg-success" : "bg-warning"}`}>{lesson.enabled ? "Enabled" : "Disabled"}</span>
                </div>
                <i className="fas fa-chevron-right"></i>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-4">
        <h4>Quizzes</h4>
        {(!quizzes || quizzes.length === 0) ? (
          <div>No quizzes added yet.</div>
        ) : (
          <ul className="list-group">
            {quizzes.map(quiz => (
              <li
                key={quiz._id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/quizzes/${quiz._id}`)}
              >
                <div>
                  <strong>{quiz.title}</strong>
                  <span className={`badge ms-2 ${quiz.enabled ? "bg-success" : "bg-warning"}`}>{quiz.enabled ? "Enabled" : "Disabled"}</span>
                </div>
                <i className="fas fa-chevron-right"></i>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Add Lesson Modal */}
      {showAddLessonModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="modal-dialog"><div className="modal-content">
            <div className="modal-header"><h5>Add New Lesson</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddLessonModal(false)}></button>
            </div>
            <form onSubmit={handleAddLesson}>
              <div className="modal-body">
                {addLessonError && <div className="alert alert-danger">{addLessonError}</div>}
                <input className="form-control mb-2" name="title" value={addLessonForm.title} onChange={e => setAddLessonForm(f => ({ ...f, title: e.target.value }))} placeholder="Lesson Title" required />
                <select className="form-control mb-2" name="type" value={addLessonForm.type} onChange={e => setAddLessonForm(f => ({ ...f, type: e.target.value }))} required>
                  <option value="">Select Type</option>
                  <option value="Text">Text</option>
                  <option value="Video">Video</option>
                  <option value="Image">Image</option>
                  <option value="PDF">PDF</option>
                  <option value="Document">Document</option>
                  <option value="Excel">Excel</option>
                </select>
                <textarea className="form-control mb-2" name="description" value={addLessonForm.description} onChange={e => setAddLessonForm(f => ({ ...f, description: e.target.value }))} placeholder="Lesson Description" required />
                {addLessonForm.type === "Text" && (
                  <textarea className="form-control mb-2" name="textContent" value={addLessonForm.textContent} onChange={e => setAddLessonForm(f => ({ ...f, textContent: e.target.value }))} placeholder="Text Content" required />
                )}
                {addLessonForm.type === "Video" && (
                  <input className="form-control mb-2" name="videoUrl" value={addLessonForm.videoUrl} onChange={e => setAddLessonForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="Video URL" required />
                )}
                {addLessonForm.type === "Image" && (
                  <input className="form-control mb-2" name="imageUrl" value={addLessonForm.imageUrl} onChange={e => setAddLessonForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="Image URL" required />
                )}
                {["PDF", "Document", "Excel"].includes(addLessonForm.type) && (
                  <input className="form-control mb-2" name="fileUrl" value={addLessonForm.fileUrl} onChange={e => setAddLessonForm(f => ({ ...f, fileUrl: e.target.value }))} placeholder="File URL (PDF, DOCX, XLSX)" required />
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" type="submit" disabled={addLessonLoading}>{addLessonLoading ? "Saving..." : "Save"}</button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowAddLessonModal(false)}>Cancel</button>
              </div>
            </form>
          </div></div>
        </div>
      )}
      {/* Add Quiz Modal */}
      {showAddQuizModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-question-circle me-2"></i>
                  Create New Quiz
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddQuizModal(false)}></button>
              </div>
              <form onSubmit={handleAddQuiz}>
                <div className="modal-body">
                  {addQuizError && (
                    <div className="alert alert-danger d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {addQuizError}
                    </div>
                  )}
                  
                  {/* Quiz Basic Info */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="bi bi-card-text me-1"></i>Quiz Title *
                      </label>
                      <input 
                        className="form-control" 
                        name="title" 
                        value={addQuizForm.title} 
                        onChange={e => setAddQuizForm(f => ({ ...f, title: e.target.value }))} 
                        placeholder="Enter an engaging quiz title" 
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="bi bi-trophy me-1"></i>Total Marks
                      </label>
                      <div className="form-control bg-light fw-bold text-primary">
                        {calculateTotalMarks(addQuizForm.questions)} marks
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <i className="bi bi-info-circle me-1"></i>Instructions
                    </label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      name="instructions" 
                      value={addQuizForm.instructions} 
                      onChange={e => setAddQuizForm(f => ({ ...f, instructions: e.target.value }))} 
                      placeholder="Provide clear instructions for students taking this quiz"
                    />
                  </div>

                  <hr className="my-4" />

                  {/* Question Builder */}
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="bi bi-plus-circle me-2"></i>Add New Question
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Question *</label>
                        <input 
                          className="form-control" 
                          name="question" 
                          value={newQuestion.question} 
                          onChange={handleQuizInputChange} 
                          placeholder="Type your question here..." 
                        />
                      </div>

                      <div className="row mb-3">
                        {Object.keys(newQuestion.options).map((key, idx) => (
                          <div className="col-md-6 mb-2" key={key}>
                            <label className="form-label fw-bold">Option {key}</label>
                            <div className="input-group">
                              <span className="input-group-text">{key}</span>
                              <input 
                                className="form-control" 
                                value={newQuestion.options[key]} 
                                onChange={e => handleOptionChange(key, e.target.value)} 
                                placeholder={`Enter option ${key}`} 
                              />
                              {Object.keys(newQuestion.options).length > 2 && (
                                <button 
                                  type="button" 
                                  className="btn btn-outline-danger" 
                                  onClick={() => handleRemoveOption(key)}
                                  title="Remove this option"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-4">
                          <button 
                            type="button" 
                            className="btn btn-outline-primary w-100" 
                            onClick={handleAddOption}
                          >
                            <i className="bi bi-plus me-1"></i>Add Option
                          </button>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-bold">Correct Answer *</label>
                          <select 
                            className="form-select" 
                            name="correctAnswer" 
                            value={newQuestion.correctAnswer} 
                            onChange={handleQuizInputChange}
                          >
                            {Object.keys(newQuestion.options).map(key => (
                              <option key={key} value={key}>Option {key}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-bold">Marks *</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            name="marks" 
                            value={newQuestion.marks} 
                            onChange={handleQuizInputChange} 
                            placeholder="Points" 
                            min="1" 
                          />
                        </div>
                      </div>

                      <button 
                        type="button" 
                        className="btn btn-success w-100" 
                        onClick={handleAddQuestion}
                        disabled={
                          !newQuestion.question || 
                          !newQuestion.marks || 
                          Object.values(newQuestion.options).some(opt => !opt.trim()) ||
                          Object.keys(newQuestion.options).length < 2
                        }
                      >
                        <i className="bi bi-check-circle me-2"></i>Add Question to Quiz
                      </button>
                    </div>
                  </div>

                  {/* Questions List */}
                  {addQuizForm.questions.length > 0 && (
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-success text-white">
                        <h6 className="mb-0">
                          <i className="bi bi-list-check me-2"></i>
                          Questions Added ({addQuizForm.questions.length})
                          <span className="badge bg-light text-dark ms-2">
                            {calculateTotalMarks(addQuizForm.questions)} Total Marks
                          </span>
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          {addQuizForm.questions.map((q, idx) => (
                            <div key={idx} className="col-12 mb-3">
                              <div className="card border-start border-primary border-3">
                                <div className="card-body py-2">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                      <h6 className="mb-1">
                                        <span className="badge bg-primary me-2">{idx + 1}</span>
                                        {q.question}
                                      </h6>
                                      <small className="text-muted">
                                        <i className="bi bi-check-circle-fill text-success me-1"></i>
                                        Correct: Option {q.correctAnswer} ({q.options[q.correctAnswer]})
                                      </small>
                                    </div>
                                    <span className="badge bg-warning text-dark">
                                      <i className="bi bi-trophy me-1"></i>{q.marks} marks
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer bg-light">
                  <button 
                    className="btn btn-success" 
                    type="submit" 
                    disabled={addQuizLoading || addQuizForm.questions.length === 0 || !addQuizForm.title.trim()}
                  >
                    {addQuizLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving Quiz...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Save Quiz ({addQuizForm.questions.length} questions)
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowAddQuizModal(false)}
                  >
                    <i className="bi bi-x-lg me-2"></i>Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Lesson Details Modal */}
      {showLessonModal && selectedLesson && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="modal-dialog"><div className="modal-content">
            <div className="modal-header">
              <h5>{selectedLesson.title}</h5>
              <button type="button" className="btn-close" onClick={() => setShowLessonModal(false)}></button>
            </div>
            <div className="modal-body">
              <p><strong>Type:</strong> {selectedLesson.type}</p>
              <p><strong>Description:</strong> {selectedLesson.description}</p>
              {selectedLesson.type === "Text" && (
                <div>
                  <strong>Content:</strong>
                  <div className="border p-2 rounded bg-light">{selectedLesson.textContent}</div>
                </div>
              )}
              {selectedLesson.type === "Video" && selectedLesson.videoUrl && (
                <div>
                  <strong>Video:</strong>
                  <div className="ratio ratio-16x9 mb-2">
                    <iframe src={selectedLesson.videoUrl} title={selectedLesson.title} allowFullScreen />
                  </div>
                </div>
              )}
              {selectedLesson.type === "Image" && selectedLesson.imageUrl && (
                <div>
                  <strong>Image:</strong>
                  <img src={selectedLesson.imageUrl} alt={selectedLesson.title} className="img-fluid rounded" />
                </div>
              )}
              {["PDF", "Document", "Excel"].includes(selectedLesson.type) && selectedLesson.fileUrl && (
                <div>
                  <strong>File:</strong>
                  <a href={selectedLesson.fileUrl} target="_blank" rel="noopener noreferrer" download>
                    Download {selectedLesson.type}
                  </a>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" onClick={() => setShowLessonModal(false)}>Close</button>
            </div>
          </div></div>
        </div>
      )}
    </div>
  );
}

export default SectionDetails;