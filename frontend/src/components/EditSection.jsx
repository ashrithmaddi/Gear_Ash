import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://gearash-production.up.railway.app";

function EditSection() {
  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [section, setSection] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    enabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
        const courseData = res.data.course || res.data;
        setCourse(courseData);
        
        const sectionData = courseData.sections.find(s => s._id === sectionId);
        if (!sectionData) {
          setError("Section not found");
          return;
        }
        
        setSection(sectionData);
        setForm({
          title: sectionData.title || "",
          description: sectionData.description || "",
          enabled: sectionData.enabled !== undefined ? sectionData.enabled : true
        });
        setError("");
      } catch (err) {
        setError("Failed to fetch section details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, sectionId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    
    try {
      // Update the section in the course's sections array
      const updatedSections = course.sections.map(s => 
        s._id === sectionId ? { ...s, ...form } : s
      );
      
      await axios.put(`${API_BASE_URL}/api/courses/update/${courseId}`, {
        sections: updatedSections
      });
      
      navigate(`/courses/${courseId}/sections/${sectionId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/courses/${courseId}/sections/${sectionId}`);
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error && !section) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-4">
      {/* Go Back Button */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}`)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Go Back
        </button>
      </div>
      
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Edit Section</h3>
              <small className="text-muted">Course: {course?.title}</small>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Section Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Optional description for this section"
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
                      id="sectionEnabled"
                    />
                    <label className="form-check-label" htmlFor="sectionEnabled">
                      Section is enabled
                    </label>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
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

export default EditSection;
