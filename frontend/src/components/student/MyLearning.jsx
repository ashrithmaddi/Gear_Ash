import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;
    fetch(`/api/student/${user._id}/my-courses`)
      .then(res => res.json())
      .then(data => setCourses(data || []));
  }, []);

  return (
    <div className="container my-5">
      <h2 className="mb-4">My Learning</h2>
      {courses.length === 0 ? (
        <div>No courses found.</div>
      ) : (
        <div className="row">
          {courses.map(course => (
            <div
              className="col-md-4 mb-4"
              key={course._id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/course-progress/${course._id}`)}
            >
              <div className="card h-100 shadow-sm">
                <img
                  src={course.image || "https://via.placeholder.com/300x180?text=No+Image"}
                  alt={course.title}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <span className="badge bg-primary">{course.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLearning;