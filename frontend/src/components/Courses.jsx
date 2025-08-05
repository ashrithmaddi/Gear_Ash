import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Courses.css";

const API_BASE_URL ="http://localhost:5000";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    activeCourses: 0,
  });
  const [categories, setCategories] = useState([]); 
  const [coursesFilter, setCoursesFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "",
    category: "",
    description: "",
    level: "",
    status: "Free",
    estimatedDuration: "",
    prerequisites: "",
    price: "",
    enabled: true,
  });
  const [addImage, setAddImage] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState(null);
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
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

  const handleCourseClick = (course) => {
    navigate(`/courses/${course._id}`);
  };

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
      setAddForm({ title: "", category: "", description: "", level: "", status: "Free", estimatedDuration: "", prerequisites: "", price: "", enabled: true });
      setAddImage(null);
      setAddImagePreview(null);
    } catch (err) {
      setAddError(err.response?.data?.message || err.message);
    } finally {
      setAddLoading(false);
    }
  };

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
                        {course.status === "Paid" ? `Paid - ₹${course.price}` : "Free"}
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