import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/student/courses/enabled");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Show only first 5 courses on hero section
        setCourses(Array.isArray(data) ? data.slice(0, 5) : data.courses?.slice(0, 5) || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      // Navigate to search page with query parameter
      navigate(`/course/search?query=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery("");
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course-detail/${courseId}`);
  };

  return (
    <div className="py-5 text-center">
      <h1 className="mb-3">Find the Best Courses for You</h1>
      <p className="mb-4">Discover, Learn, and Upskill </p>
      
      {/* Search Form */}
      <form onSubmit={searchHandler} className="d-flex justify-content-center mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search Courses"
          className="form-control w-25"
        />
        <button type="submit" className="btn btn-primary ms-2">Search</button>
      </form>
      
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate("/courses")}
      >
        Explore All Courses
      </button>

      {/* Featured Courses Grid */}
      <div className="container">
        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading courses...</span>
            </div>
          </div>
        ) : courses.length > 0 ? (
          <>
            <h3 className="mb-4">Featured Courses</h3>
            <div className="row justify-content-center">
              {courses.map(course => (
                <div
                  className="col-md-2 mb-4"
                  key={course._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCourseClick(course._id)}
                >
                  <div className="card h-100 shadow-sm">
                    <img
                      src={course.image || course.courseThumbnail || "https://via.placeholder.com/300x180?text=No+Image"}
                      alt={course.title || course.courseTitle}
                      className="card-img-top"
                      style={{ height: "120px", objectFit: "cover" }}
                    />
                    <div className="card-body p-2">
                      <h6 className="card-title mb-1" style={{ fontWeight: 600 }}>
                        {course.title || course.courseTitle}
                      </h6>
                      <div className="text-muted" style={{ fontSize: "0.9em" }}>
                        {course.level || course.courseLevel || "Beginner"}
                      </div>
                      <div className="fw-bold mt-1" style={{ color: "#0d47a1" }}>
                        {course.status || "Available"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="alert alert-info">
            No courses available at the moment. Check back later!
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;