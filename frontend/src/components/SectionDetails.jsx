import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

function SectionDetails() {
  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [course, setCourse] = useState(null);
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
    options: { A: "", B: "" },
    correctAnswer: "A"
  });
  const [addQuizError, setAddQuizError] = useState("");
  const [addQuizLoading, setAddQuizLoading] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const fetchSection = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
        setCourse(res.data.course || res.data);
        const foundSection = (res.data.course || res.data).sections.find(s => s._id === sectionId);
        setSection(foundSection);
        setError("");
      } catch (err) {
        setError("Failed to fetch section details.");
      } finally {
        setLoading(false);
      }
    };
    fetchSection();
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
    setNewQuestion(q => ({ ...q, [name]: value }));
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
      !newQuestion.correctAnswer ||
      !Object.keys(newQuestion.options).includes(newQuestion.correctAnswer)
    ) return;
    setAddQuizForm(f => ({
      ...f,
      questions: [...f.questions, { ...newQuestion }]
    }));
    setNewQuestion({ question: "", options: { A: "", B: "" }, correctAnswer: "A" });
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    setAddQuizLoading(true);
    setAddQuizError("");
    try {
      await axios.post(`${API_BASE_URL}/api/quizzes`, {
        lessonId: sectionId, // or pass correct lessonId if needed
        title: addQuizForm.title,
        instructions: addQuizForm.instructions,
        questions: addQuizForm.questions
      });
      // Refetch section
      const res = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
      const foundSection = (res.data.course || res.data).sections.find(s => s._id === sectionId);
      setSection(foundSection);
      setShowAddQuizModal(false);
      setAddQuizForm({ title: "", instructions: "", questions: [] });
    } catch (err) {
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>{section.title}</h2>
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
              <li><button className="dropdown-item" onClick={() => setShowAddQuizModal(true)}>Add Quiz</button></li>
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
        {(!section.quizzes || section.quizzes.length === 0) ? (
          <div>No quizzes added yet.</div>
        ) : (
          <ul className="list-group">
            {section.quizzes.map(quiz => (
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
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="modal-dialog"><div className="modal-content">
            <div className="modal-header"><h5>Add New Quiz</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddQuizModal(false)}></button>
            </div>
            <form onSubmit={handleAddQuiz}>
              <div className="modal-body">
                {addQuizError && <div className="alert alert-danger">{addQuizError}</div>}
                <input className="form-control mb-2" name="title" value={addQuizForm.title} onChange={e => setAddQuizForm(f => ({ ...f, title: e.target.value }))} placeholder="Quiz Title" required />
                <textarea className="form-control mb-2" name="instructions" value={addQuizForm.instructions} onChange={e => setAddQuizForm(f => ({ ...f, instructions: e.target.value }))} placeholder="Instructions" required />
                <hr />
                <h6>Add Multiple Choice Question</h6>
                <input className="form-control mb-2" name="question" value={newQuestion.question} onChange={handleQuizInputChange} placeholder="Question" required />
                {Object.keys(newQuestion.options).map((key, idx) => (
                  <div className="mb-2" key={key}>
                    <label>Option {key}</label>
                    <div className="input-group">
                      <input className="form-control" value={newQuestion.options[key]} onChange={e => handleOptionChange(key, e.target.value)} placeholder={`Option ${key}`} required />
                      {Object.keys(newQuestion.options).length > 2 && (
                        <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveOption(key)}>Remove</button>
                      )}
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-outline-primary mb-2" onClick={handleAddOption}>Add Option</button>
                <div className="mb-2">
                  <label>Correct Answer</label>
                  <select className="form-control" name="correctAnswer" value={newQuestion.correctAnswer} onChange={handleQuizInputChange}>
                    {Object.keys(newQuestion.options).map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
                <button type="button" className="btn btn-success mb-2" onClick={handleAddQuestion}>Add Question</button>
                <div>
                  <h6>Questions Added:</h6>
                  <ul>
                    {addQuizForm.questions.map((q, idx) => (
                      <li key={idx}>
                        {q.question} - Correct: {q.correctAnswer} ({q.options[q.correctAnswer]})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" type="submit" disabled={addQuizLoading}>{addQuizLoading ? "Saving..." : "Save"}</button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowAddQuizModal(false)}>Cancel</button>
              </div>
            </form>
          </div></div>
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