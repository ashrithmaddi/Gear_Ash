import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config/config";

const API_BASE_URL = config.apiBaseUrl;

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [quizCounts, setQuizCounts] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [addSectionForm, setAddSectionForm] = useState({ title: "", description: "", enabled: true });
  const [addSectionError, setAddSectionError] = useState("");
  const [addSectionLoading, setAddSectionLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
        const courseData = res.data.course || res.data;
        setCourse(courseData);
        
        // Fetch quiz counts for each section
        const counts = {};
        if (courseData.sections && courseData.sections.length > 0) {
          try {
            const sectionIds = courseData.sections.map(section => section._id);
            const countsRes = await axios.post(`${API_BASE_URL}/api/quizzes/counts`, { sectionIds });
            Object.assign(counts, countsRes.data);
          } catch (err) {
            console.error("Error fetching quiz counts:", err);
            // Fallback to individual requests if the batch endpoint fails
            await Promise.all(
              courseData.sections.map(async (section) => {
                try {
                  const quizRes = await axios.get(`${API_BASE_URL}/api/quizzes/section/${section._id}`);
                  counts[section._id] = quizRes.data ? quizRes.data.length : 0;
                } catch (err) {
                  console.error(`Error fetching quizzes for section ${section._id}:`, err);
                  counts[section._id] = 0;
                }
              })
            );
          }
        }
        setQuizCounts(counts);
        setError("");
      } catch (err) {
        setError("Failed to fetch course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleDeleteCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/courses/delete/${courseId}`);
      navigate("/courses");
    } catch (err) {
      alert("Failed to delete course: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleCourseEnabled = async () => {
    try {
      await axios.patch(`${API_BASE_URL}/api/courses/toggle-enabled/${courseId}`, { enabled: !course.enabled });
      setCourse({ ...course, enabled: !course.enabled });
    } catch (err) {
      alert("Failed to toggle course: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    setAddSectionLoading(true);
    setAddSectionError("");
    try {
      const updatedSections = [
        ...(course.sections || []),
        {
          title: addSectionForm.title,
          description: addSectionForm.description,
          lessons: [],
          quizzes: [],
          enabled: addSectionForm.enabled,
        },
      ];
      const res = await axios.put(`${API_BASE_URL}/api/courses/update/${courseId}`, { sections: updatedSections });
      const updatedCourse = res.data;
      setCourse(updatedCourse);
      
      // Refresh quiz counts for the new section structure
      const counts = {};
      if (updatedCourse.sections && updatedCourse.sections.length > 0) {
        try {
          const sectionIds = updatedCourse.sections.map(section => section._id);
          const countsRes = await axios.post(`${API_BASE_URL}/api/quizzes/counts`, { sectionIds });
          Object.assign(counts, countsRes.data);
        } catch (err) {
          // Fallback to individual requests
          await Promise.all(
            updatedCourse.sections.map(async (section) => {
              try {
                const quizRes = await axios.get(`${API_BASE_URL}/api/quizzes/section/${section._id}`);
                counts[section._id] = quizRes.data ? quizRes.data.length : 0;
              } catch (err) {
                counts[section._id] = 0;
              }
            })
          );
        }
      }
      setQuizCounts(counts);
      
      setShowAddSectionModal(false);
      setAddSectionForm({ title: "", description: "", enabled: true });
    } catch (err) {
      setAddSectionError(err.response?.data?.message || err.message);
    } finally {
      setAddSectionLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!course) return <div>No course found.</div>;

  return (
    <div className="container my-4">
      {/* Go Back Button */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate("/courses")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Courses
        </button>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          {course.image && (
            <img 
              src={course.image} 
              alt={course.title}
              className="me-3"
              style={{ 
                width: '80px', 
                height: '80px', 
                objectFit: 'cover', 
                borderRadius: '8px',
                border: '2px solid #dee2e6'
              }}
            />
          )}
          <div>
            <h2>{course.title}</h2>
            <div>
              <span className="badge bg-primary me-2">{course.category}</span>
              <span className="badge bg-secondary me-2">{course.level}</span>
              <span className={`badge ${course.enabled ? "bg-success" : "bg-warning"}`}>{course.enabled ? "Enabled" : "Disabled"}</span>
              <span className={`badge ms-2 ${course.status === "Paid" ? "bg-danger" : "bg-info"}`}>
                {course.status === "Paid" ? `Paid - ₹${course.amount}` : "Free"}
              </span>
            </div>
          </div>
        </div>
        <div className="dropdown">
          <button className="btn btn-outline-secondary dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
            Settings
          </button>
          {showDropdown && (
            <ul className="dropdown-menu show" style={{ position: "absolute", right: 0 }}>
              <li><button className="dropdown-item" onClick={() => navigate(`/courses/${course._id}/edit`)}>Edit Course</button></li>
              <li><button className="dropdown-item" onClick={handleToggleCourseEnabled}>{course.enabled ? "Disable" : "Enable"} Course</button></li>
              <li><button className="dropdown-item" onClick={() => setShowAddSectionModal(true)}>Add Section</button></li>
              <li><button className="dropdown-item text-danger" onClick={handleDeleteCourse}>Delete Course</button></li>
            </ul>
          )}
        </div>
      </div>
      <div className="mb-3">
        <h5>Description</h5>
        <p>{course.description}</p>
      </div>
      <div className="mb-4">
        <h4>Sections</h4>
        {(!course.sections || course.sections.length === 0) ? (
          <div>No sections added yet.</div>
        ) : (
          <ul className="list-group">
            {course.sections.map(section => (
              <li
                key={section._id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/courses/${course._id}/sections/${section._id}`)}
              >
                <div>
                  <strong>{section.title}</strong>
                  <span className="badge bg-primary ms-2">{section.lessons?.length || 0} Lessons</span>
                  <span className="badge bg-secondary ms-2">{quizCounts[section._id] || 0} Quizzes</span>
                  <span className={`badge ms-2 ${section.enabled ? "bg-success" : "bg-warning"}`}>{section.enabled ? "Enabled" : "Disabled"}</span>
                </div>
                <i className="fas fa-chevron-right"></i>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="modal-dialog"><div className="modal-content">
            <div className="modal-header"><h5>Add New Section</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddSectionModal(false)}></button>
            </div>
            <form onSubmit={handleAddSection}>
              <div className="modal-body">
                {addSectionError && <div className="alert alert-danger">{addSectionError}</div>}
                <label className="form-label">Section Title</label>
                <input className="form-control mb-2" name="title" value={addSectionForm.title} onChange={e => setAddSectionForm(f => ({ ...f, title: e.target.value }))} placeholder="Section Title" required />
                <label className="form-label">Description</label>
                <textarea className="form-control mb-2" name="description" value={addSectionForm.description} onChange={e => setAddSectionForm(f => ({ ...f, description: e.target.value }))} placeholder="Section Description" rows={3} />
                <label className="form-label">Enabled</label>
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" checked={addSectionForm.enabled} onChange={e => setAddSectionForm(f => ({ ...f, enabled: e.target.checked }))} />
                  <label className="form-check-label">{addSectionForm.enabled ? "Enabled" : "Disabled"}</label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" type="submit" disabled={addSectionLoading}>{addSectionLoading ? "Saving..." : "Save"}</button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowAddSectionModal(false)}>Cancel</button>
              </div>
            </form>
          </div></div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;