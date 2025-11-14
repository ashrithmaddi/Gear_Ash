import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ImageUpload from "./ImageUpload";
import config from "../config/config";

const API_BASE_URL = config.apiBaseUrl;

function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    level: "",
    status: "Free",
    amount: 0,
    image: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
        const courseData = res.data.course || res.data;
        setCourse(courseData);
        setForm({
          title: courseData.title || "",
          category: courseData.category || "",
          description: courseData.description || "",
          level: courseData.level || "",
          status: courseData.status || "Free",
          amount: courseData.amount || 0,
          image: courseData.image || null
        });
        setError("");
      } catch (err) {
        setError("Failed to fetch course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    
    try {
      await axios.put(`${API_BASE_URL}/api/courses/update/${courseId}`, form);
      navigate(`/courses/${courseId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error && !course) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-4">
      {/* Go Back Button */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Go Back
        </button>
      </div>
      
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Edit Course</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Course Title *</label>
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
                  <label className="form-label">Category *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="mb-3">
                  <ImageUpload
                    currentImage={form.image}
                    onImageChange={(image) => setForm(prev => ({ ...prev, image }))}
                    label="Course Image"
                    className="mb-3"
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Level *</label>
                    <select
                      className="form-select"
                      name="level"
                      value={form.level}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>

                {form.status === "Paid" && (
                  <div className="mb-3">
                    <label className="form-label">Course Amount *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                )}

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

export default EditCourse;
