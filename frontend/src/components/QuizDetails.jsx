import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://gearash-production.up.railway.app";

function QuizDetails() {
  const { courseId, sectionId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/quizzes/${quizId}`);
        const quizData = res.data;
        
        // If section is null/unknown, fetch the section name from course data
        if (!quizData.section || !quizData.section.title) {
          try {
            const courseRes = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
            const course = courseRes.data.course || courseRes.data;
            const section = course.sections.find(s => s._id === sectionId);
            
            if (section) {
              quizData.section = { _id: section._id, title: section.title };
            }
          } catch (err) {
            console.error("Error fetching course data:", err);
          }
        }
        
        setQuiz(quizData);
        setError("");
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to fetch quiz details.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, courseId, sectionId]);

  const handleBackToSection = () => {
    navigate(`/courses/${courseId}/sections/${sectionId}`);
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!quiz) return <div className="container mt-4"><div className="alert alert-warning">Quiz not found.</div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-outline-secondary me-3" onClick={handleBackToSection}>
          <i className="bi bi-arrow-left me-2"></i>Back to Section
        </button>
        <h2 className="mb-0">{quiz.title}</h2>
        <span className={`badge ms-3 ${quiz.enabled ? "bg-success" : "bg-warning"} fs-6`}>
          {quiz.enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Quiz Information</h4>
            </div>
            <div className="card-body">
              {quiz.instructions && (
                <div className="mb-3">
                  <strong>Instructions:</strong>
                  <p className="mt-2">{quiz.instructions}</p>
                </div>
              )}
              
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Total Questions:</strong> {quiz.questions?.length || 0}
                </div>
                <div className="col-md-4">
                  <strong>Total Marks:</strong> {quiz.totalMarks || 0}
                </div>
                <div className="col-md-4">
                  <strong>Time Limit:</strong> {quiz.timeLimit || 60} minutes
                </div>
              </div>

              <div className="mt-4">
                <h5>Questions Preview:</h5>
                {quiz.questions && quiz.questions.length > 0 ? (
                  <div className="accordion" id="questionsAccordion">
                    {quiz.questions.map((question, index) => (
                      <div className="accordion-item" key={index}>
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button collapsed" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target={`#collapse${index}`}
                            aria-expanded="false"
                            aria-controls={`collapse${index}`}
                          >
                            Question {index + 1} - {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                          </button>
                        </h2>
                        <div 
                          id={`collapse${index}`} 
                          className="accordion-collapse collapse" 
                          aria-labelledby={`heading${index}`}
                          data-bs-parent="#questionsAccordion"
                        >
                          <div className="accordion-body">
                            <p><strong>{question.question}</strong></p>
                            <div className="row">
                              {question.options && question.options.map((option, optIndex) => (
                                <div className="col-md-6 mb-2" key={optIndex}>
                                  <span className={`badge ${parseInt(question.answer) === optIndex + 1 ? 'bg-success' : 'bg-light text-dark'} me-2`}>
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  {option}
                                </div>
                              ))}
                            </div>
                            <div className="mt-2">
                              <small className="text-success">
                                <strong>Correct Answer: Option {String.fromCharCode(64 + parseInt(question.answer))}</strong>
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No questions added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/quizzes/${quizId}/edit`)}
                >
                  <i className="bi bi-pencil me-2"></i>Edit Quiz
                </button>
                <button 
                  className={`btn ${quiz.enabled ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => alert("Toggle functionality not implemented yet")}
                >
                  <i className={`bi ${quiz.enabled ? 'bi-pause' : 'bi-play'} me-2`}></i>
                  {quiz.enabled ? 'Disable' : 'Enable'} Quiz
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => alert("Delete functionality not implemented yet")}
                >
                  <i className="bi bi-trash me-2"></i>Delete Quiz
                </button>
              </div>

              <hr />

              <div className="mt-3">
                <h6>Quiz Statistics:</h6>
                <p className="text-muted mb-1">Created: {new Date(quiz.createdAt).toLocaleDateString()}</p>
                <p className="text-muted mb-1">Course: {quiz.course?.title || 'Unknown'}</p>
                <p className="text-muted mb-0">Section: {quiz.section?.title || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizDetails;
