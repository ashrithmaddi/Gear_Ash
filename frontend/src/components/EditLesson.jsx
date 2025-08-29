import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://gearash-production.up.railway.app";

function EditLesson() {
  const { courseId, sectionId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [section, setSection] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    enabled: true,
    textContent: "",
    videoUrl: "",
    imageUrl: "",
    fileUrl: ""
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
        
        const lessonData = sectionData.lessons?.find(l => l._id === lessonId);
        if (!lessonData) {
          setError("Lesson not found");
          return;
        }
        
        setLesson(lessonData);
        setForm({
          title: lessonData.title || "",
          type: lessonData.type || "",
          description: lessonData.description || "",
          enabled: lessonData.enabled !== undefined ? lessonData.enabled : true,
          textContent: lessonData.textContent || "",
          videoUrl: lessonData.videoUrl || "",
          imageUrl: lessonData.imageUrl || "",
          fileUrl: lessonData.fileUrl || ""
        });
        setError("");
      } catch (err) {
        setError("Failed to fetch lesson details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, sectionId, lessonId]);

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
      // Prepare lesson payload based on type
      const payload = {
        title: form.title,
        type: form.type,
        description: form.description,
        enabled: form.enabled
      };

      if (form.type === "Text") {
        payload.textContent = form.textContent;
      } else if (form.type === "Video") {
        payload.videoUrl = form.videoUrl;
      } else if (form.type === "Image") {
        payload.imageUrl = form.imageUrl;
      } else if (["PDF", "Document", "Excel"].includes(form.type)) {
        payload.fileUrl = form.fileUrl;
      }

      // Update the lesson in the section's lessons array
      const updatedLessons = section.lessons.map(l => 
        l._id === lessonId ? { ...l, ...payload } : l
      );

      // Update the section in the course's sections array
      const updatedSections = course.sections.map(s => 
        s._id === sectionId ? { ...s, lessons: updatedLessons } : s
      );
      
      await axios.put(`${API_BASE_URL}/api/courses/update/${courseId}`, {
        sections: updatedSections
      });
      
      navigate(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error && !lesson) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-4">
      {/* Go Back Button */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Go Back
        </button>
      </div>
      
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Edit Lesson</h3>
              <small className="text-muted">
                Course: {course?.title} → Section: {section?.title}
              </small>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Lesson Title *</label>
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
                  <label className="form-label">Type *</label>
                  <select
                    className="form-control"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Text">Text</option>
                    <option value="Video">Video</option>
                    <option value="Image">Image</option>
                    <option value="PDF">PDF</option>
                    <option value="Document">Document</option>
                    <option value="Excel">Excel</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Optional description for this lesson"
                  />
                </div>

                {form.type === "Text" && (
                  <div className="mb-3">
                    <label className="form-label">Text Content *</label>
                    <textarea
                      className="form-control"
                      name="textContent"
                      value={form.textContent}
                      onChange={handleChange}
                      rows="5"
                      required
                    />
                  </div>
                )}

                {form.type === "Video" && (
                  <div className="mb-3">
                    <label className="form-label">Video URL *</label>
                    <input
                      type="url"
                      className="form-control"
                      name="videoUrl"
                      value={form.videoUrl}
                      onChange={handleChange}
                      placeholder="YouTube, Google Drive, or direct video URL"
                      required
                    />
                  </div>
                )}

                {form.type === "Image" && (
                  <div className="mb-3">
                    <label className="form-label">Image URL *</label>
                    <input
                      type="url"
                      className="form-control"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="Direct image URL"
                      required
                    />
                  </div>
                )}

                {["PDF", "Document", "Excel"].includes(form.type) && (
                  <div className="mb-3">
                    <label className="form-label">File URL *</label>
                    <input
                      type="url"
                      className="form-control"
                      name="fileUrl"
                      value={form.fileUrl}
                      onChange={handleChange}
                      placeholder="Direct file URL"
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="enabled"
                      checked={form.enabled}
                      onChange={handleChange}
                      id="lessonEnabled"
                    />
                    <label className="form-check-label" htmlFor="lessonEnabled">
                      Lesson is enabled
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

export default EditLesson;
