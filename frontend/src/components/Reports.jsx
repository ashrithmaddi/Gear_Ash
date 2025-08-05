import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reports.css";

function Reports() {
  // State for summary stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalLecturers: 0,
    activeLecturers: 0,
    totalCourses: 0,
    activeCourses: 0,
    adminRevenue: 0,
  });

  // State for course list
  const [courses, setCourses] = useState([]);
  // State for enrollment stats
  const [enrollmentStats, setEnrollmentStats] = useState({});
  // State for active users
  const [activeUsers, setActiveUsers] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch all summary stats and course list
    const fetchStats = async () => {
      try {
        const [
          totalStudentsRes,
          activeStudentsRes,
          totalLecturersRes,
          activeLecturersRes,
          totalCoursesRes,
          activeCoursesRes,
          adminRevenueRes,
          courseListRes,
          enrollmentStatsRes,
          activeUsersRes,
          categoriesRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/getTotalStudents"),
          axios.get("http://localhost:5000/api/admin/getActiveStudents"),
          axios.get("http://localhost:5000/api/admin/getTotalLecturers"),
          axios.get("http://localhost:5000/api/admin/getActiveLecturers"),
          axios.get("http://localhost:5000/api/admin/getTotalCourses"),
          axios.get("http://localhost:5000/api/admin/getActiveCourses"),
          axios.get("http://localhost:5000/api/reports/revenue"),
          axios.get("http://localhost:5000/api/admin/getCourseList"),
          axios.get("http://localhost:5000/api/reports/enrollment-stats"),
          axios.get("http://localhost:5000/api/reports/active-users"),
          axios.get("http://localhost:5000/api/categories"),
        ]);
        setStats({
          totalStudents: totalStudentsRes.data.students || 0,
          activeStudents: activeStudentsRes.data.active || 0,
          totalLecturers: totalLecturersRes.data.lecturers || 0,
          activeLecturers: activeLecturersRes.data.active || 0,
          totalCourses: totalCoursesRes.data.courses || 0,
          activeCourses: activeCoursesRes.data.activeCourses || 0,
          adminRevenue: adminRevenueRes.data.adminRevenue || 0,
        });
        setCourses(courseListRes.data.courseList || []);
        setEnrollmentStats(enrollmentStatsRes.data.enrollmentStats || {});
        setActiveUsers(activeUsersRes.data.activeUsers || 0);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        // fallback to zeroes
        setStats({
          totalStudents: 0,
          activeStudents: 0,
          totalLecturers: 0,
          activeLecturers: 0,
          totalCourses: 0,
          activeCourses: 0,
          adminRevenue: 0,
        });
        setCourses([]);
        setEnrollmentStats({});
        setActiveUsers(0);
        setCategories([]);
      }
    };
    fetchStats();
  }, []);

  // Filtered course list
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "All" || course.level === levelFilter;
    const matchesStatus = statusFilter === "All" || (course.enabled ? "Active" : "Inactive") === statusFilter;
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  // Enrollment stats for chart
  const enrollmentLabels = Object.keys(enrollmentStats || {});
  const enrollmentValues = Object.values(enrollmentStats || {});

  return (
    <div className="reports-container">
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card bg-primary text-white">
            <h6>Total Students</h6>
            <h3>{stats.totalStudents}</h3>
            <p>All Registered</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-success text-white">
            <h6>Active Students</h6>
            <h3>{stats.activeStudents}</h3>
            <p>Currently Active</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-info text-white">
            <h6>Total Lecturers</h6>
            <h3>{stats.totalLecturers}</h3>
            <p>All Faculty</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-warning text-white">
            <h6>Active Lecturers</h6>
            <h3>{stats.activeLecturers}</h3>
            <p>Currently Teaching</p>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card bg-secondary text-white">
            <h6>Total Courses</h6>
            <h3>{stats.totalCourses}</h3>
            <p>All Programs</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-success text-white">
            <h6>Active Courses</h6>
            <h3>{stats.activeCourses}</h3>
            <p>Currently Enabled</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-dark text-white">
            <h6>Active Users</h6>
            <h3>{activeUsers}</h3>
            <p>Logged In</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-success text-white">
            <h6>Admin Revenue</h6>
            <h3>₹{stats.adminRevenue}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Enrollment Stats Chart */}
      <div className="card mb-4">
        <div className="card-header">Enrollment Stats (by Course)</div>
        <div className="card-body">
          {enrollmentLabels.length === 0 ? (
            <div>No enrollment data available.</div>
          ) : (
            <div style={{ maxWidth: 600 }}>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Enrollments</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollmentLabels.map((label, idx) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{enrollmentValues[idx]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Course Filters */}
      <div className="card mb-4">
        <div className="card-header">Course Filters</div>
        <div className="card-body row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by course name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-control"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Table */}
      <div className="card">
        <div className="card-header">Course Details</div>
        <div className="card-body table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Course Name</th>
                <th>Category</th>
                <th>Level</th>
                <th>Status</th>
                <th>Enrolled Students</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">No courses found.</td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course._id}>
                    <td>{course.title}</td>
                    <td>{course.category}</td>
                    <td>{course.level}</td>
                    <td>
                      <span className={`badge ${course.enabled ? "bg-success" : "bg-secondary"}`}>
                        {course.enabled ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{course.enrolledStudents?.length || 0}</td>
                    <td>{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : ""}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;