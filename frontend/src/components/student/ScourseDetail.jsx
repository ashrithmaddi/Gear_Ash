import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BuyCourseButton from "./BuyCourseButton";

const ScourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => setCourse(data));

    // Check if purchased (only for paid courses)
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      fetch(`/api/enrollments/is-enrolled?student=${user._id}&course=${courseId}`)
        .then(res => res.json())
        .then(data => setIsPurchased(data.isEnrolled));
    }
  }, [courseId]);

  if (!course) return <div>Loading...</div>;

  const canView = course.status === "Free" || isPurchased;

  return (
    <div className="container my-5">
      <div className="row">
        {/* Left: Course details */}
        <div className="col-md-8">
          <img
            src={course.image || "https://via.placeholder.com/600x300?text=No+Image"}
            alt={course.title}
            className="img-fluid rounded mb-3"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
          <h2>{course.title}</h2>
          <div className="mb-2 text-muted">
            Level: <b>{course.level}</b> | Status: <b>{course.status}</b>
          </div>
          <p>{course.description}</p>
          <h5 className="mt-4">Course Content</h5>
          <div className="accordion" id="courseAccordion">
            {course.sections && course.sections.length > 0 ? (
              course.sections.map((section, idx) => (
                <div className="accordion-item" key={section._id || idx}>
                  <h2 className="accordion-header" id={`heading${idx}`}>
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${idx}`}
                      aria-expanded="false"
                      aria-controls={`collapse${idx}`}
                    >
                      {section.title} <span className="ms-2 text-muted" style={{ fontSize: "0.9em" }}>
                        {section.lessons?.length || 0} lessons
                      </span>
                    </button>
                  </h2>
                  <div
                    id={`collapse${idx}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${idx}`}
                    data-bs-parent="#courseAccordion"
                  >
                    <div className="accordion-body">
                      <ul className="list-group">
                        {section.lessons && section.lessons.length > 0 ? (
                          section.lessons.map(lesson => (
                            <li className="list-group-item" key={lesson._id || lesson.title}>
                              {lesson.title}
                            </li>
                          ))
                        ) : (
                          <li className="list-group-item">No lessons in this section.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No sections/lessons yet.</div>
            )}
          </div>
        </div>
        {/* Right: Purchase/View Course */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm sticky-top" style={{ top: 80 }}>
            <h3 className="fw-bold mb-2" style={{ color: "#7c3aed" }}>
              {course.status === "Paid" ? "Paid" : "Free"}
            </h3>
            <div className="mb-3">
              {canView ? (
                <button
                  className="btn btn-success w-100"
                  onClick={() => navigate(`/course-progress/${courseId}`)}
                >
                  View Course
                </button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </div>
            <div>
              <span className="text-muted">
                {course.sections
                  ? course.sections.reduce((acc, sec) => acc + (sec.lessons ? sec.lessons.length : 0), 0)
                  : 0} lectures
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScourseDetail;