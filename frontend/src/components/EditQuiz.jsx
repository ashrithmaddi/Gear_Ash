import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { userAdminContextObj } from "../context/UserAdmin";

const API_BASE_URL = "https://gearash-production.up.railway.app";

function EditQuiz() {
  const { courseId, sectionId, quizId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(userAdminContextObj);
  const [quiz, setQuiz] = useState(null);
  const [form, setForm] = useState({
    title: "",
    instructions: "",
    timeLimit: "",
    enabled: true,
    questions: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/quizzes/${quizId}`);
        const quizData = res.data;
        setQuiz(quizData);
        
        // Convert questions to match frontend format
        const convertedQuestions = (quizData.questions || []).map(q => ({
          ...q,
          answer: q.answer || (q.correctAnswer !== undefined ? (q.correctAnswer + 1).toString() : "1"),
          marks: q.marks || 1
        }));
        
        setForm({
          title: quizData.title || "",
          instructions: quizData.instructions || "",
          timeLimit: quizData.timeLimit || "",
          enabled: quizData.enabled !== undefined ? quizData.enabled : true,
          questions: convertedQuestions
        });
        setError("");
      } catch (err) {
        setError("Failed to fetch quiz details.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options.map((opt, j) => 
                j === optionIndex ? value : opt
              ) 
            } 
          : q
      )
    }));
  };

  const addQuestion = () => {
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, {
        question: "",
        options: ["", "", "", ""],
        answer: "1",
        marks: 1
      }]
    }));
  };

  const removeQuestion = (index) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    
    try {
      await axios.put(`${API_BASE_URL}/api/quizzes/update/${quizId}`, form);
      navigate(`/courses/${courseId}/sections/${sectionId}/quizzes/${quizId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/courses/${courseId}/sections/${sectionId}/quizzes/${quizId}`);
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error && !quiz) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-4">
      {/* Go Back Button */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/quizzes/${quizId}`)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Go Back
        </button>
      </div>
      
      <div className="row">
        <div className="col-md-10 mx-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Edit Quiz</h3>
              <small className="text-muted">Quiz: {quiz?.title}</small>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Quiz Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Time Limit (minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="timeLimit"
                        value={form.timeLimit}
                        onChange={handleChange}
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Instructions</label>
                  <textarea
                    className="form-control"
                    name="instructions"
                    value={form.instructions}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Optional instructions for this quiz"
                  />
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="enabled"
                      checked={form.enabled}
                      onChange={handleChange}
                      id="quizEnabled"
                    />
                    <label className="form-check-label" htmlFor="quizEnabled">
                      Quiz is enabled
                    </label>
                  </div>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Questions</h5>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={addQuestion}
                  >
                    <i className="bi bi-plus me-1"></i>
                    Add Question
                  </button>
                </div>

                {form.questions.map((question, qIndex) => (
                  <div key={qIndex} className="card mb-3">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <span>Question {qIndex + 1}</span>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeQuestion(qIndex)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Question Text *</label>
                        <textarea
                          className="form-control"
                          value={question.question}
                          onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                          rows="2"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Marks *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={question.marks}
                          onChange={(e) => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value) || 1)}
                          min="1"
                          required
                          style={{ maxWidth: '100px' }}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Options</label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="mb-2 d-flex align-items-center">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={question.answer === (oIndex + 1).toString()}
                                onChange={() => handleQuestionChange(qIndex, 'answer', (oIndex + 1).toString())}
                              />
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                        <small className="text-muted">Select the radio button for the correct answer</small>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditQuiz;
