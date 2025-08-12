import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (urlQuery) {
      setQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === "") return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/courses/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.success) {
        setCourses(data.courses || []);
      } else {
        setError(data.message || "Failed to search courses");
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search courses. Please try again.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/course/search?query=${encodeURIComponent(query)}`);
      performSearch(query);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course-detail/${courseId}`);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Search Courses</h2>

      <form onSubmit={handleSearch} className="mb-4 d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for courses"
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && courses.length === 0 && query && (
        <div className="alert alert-info">
          No courses found for "{query}".
        </div>
      )}

      {courses.length > 0 && (
        <>
          <h4 className="mb-3">
            Found {courses.length} course{courses.length !== 1 ? "s" : ""} for "{query}"
          </h4>

          <div className="row">
            {courses.map((course) => (
              <div
                className="col-lg-4 col-md-6 mb-4"
                key={course._id}
                onClick={() => handleCourseClick(course._id)}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow-sm">
                  <img
                    src={course.image || course.courseThumbnail || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={course.title || course.courseTitle}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-2">{course.title || course.courseTitle}</h5>
                    <p className="card-text text-muted small mb-2">
                      {course.subtitle || course.subTitle || course.description?.slice(0, 100) + "..."}
                    </p>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-primary">
                          {course.level || course.courseLevel || "Beginner"}
                        </span>
                        <span className="fw-bold text-primary">
                          ₹{course.price || course.coursePrice || "Free"}
                        </span>
                      </div>
                      {course.creator && (
                        <small className="text-muted">By: {course.creator.name}</small>
                      )}
                      <div className="mt-2">
                        <span className="badge bg-success">
                          {course.status || "Available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;