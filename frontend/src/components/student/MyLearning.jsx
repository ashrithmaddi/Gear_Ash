import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      setLoading(false);
      return;
    }
    
    fetch(`/api/student/${user._id}/my-courses`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch enrolled courses");
        return res.json();
      })
      .then(data => {
        // If backend returns only course IDs, fetch course details for each
        if (Array.isArray(data) && typeof data[0] === "string") {
          Promise.all(
            data.map(id =>
              fetch(`/api/courses/${id}`).then(res => res.json())
            )
          ).then(fullCourses => {
            setCourses(fullCourses);
            setFilteredCourses(fullCourses);
            setLoading(false);
          });
        } else {
          setCourses(data || []);
          setFilteredCourses(data || []);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const LoadingSkeleton = () => (
    <div className="row">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="col-md-3 mb-4">
          <div className="card h-100 shadow-sm">
            <div 
              className="bg-light" 
              style={{ height: "180px", animation: "pulse 1.5s ease-in-out infinite" }}
            />
            <div className="card-body text-center">
              <div 
                className="bg-light rounded mx-auto" 
                style={{ height: "20px", width: "80%", animation: "pulse 1.5s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container my-5">
      {/* Header */}
      <h2 className="mb-4">My Learning</h2>
      
      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="position-relative">
            <Search 
              size={20} 
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
            />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-5">
          <div className="text-muted">
            {searchTerm ? "No courses found matching your search." : "No courses found."}
          </div>
        </div>
      ) : (
        <div className="row">
          {filteredCourses.map(course => (
            <div
              className="col-md-3 mb-4"
              key={course._id}
              onClick={() => navigate(`/course-detail/${course._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div 
                className="card h-100 shadow-sm text-center course-card"
                style={{ transition: "all 0.3s ease" }}
              >
                <img
                  src={course.image || "https://via.placeholder.com/300x180?text=No+Image"}
                  alt={course.title}
                  className="card-img-top"
                  style={{ 
                    height: "180px", 
                    objectFit: "cover",
                    transition: "transform 0.3s ease"
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .course-card:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default MyLearning;