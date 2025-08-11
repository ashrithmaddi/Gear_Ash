import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ScourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      
      // Fetch course details
      await fetchCourseDetails();
      
      // Check enrollment status
      await checkEnrollmentStatus();
      
      setLoading(false);
    };

    loadCourseData();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
      } else {
        console.error("Failed to fetch course details");
      }
    } catch (err) {
      console.error("Error fetching course details:", err);
    }
  };

  const checkEnrollmentStatus = async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user._id) {
      setIsEnrolled(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/enrollments/is-enrolled?student=${user._id}&course=${courseId}`
      );
      
      if (res.ok) {
        const data = await res.json();
        setIsEnrolled(data.isEnrolled || false);
      } else {
        setIsEnrolled(false);
      }
    } catch (err) {
      console.error("Error checking enrollment:", err);
      setIsEnrolled(false);
    }
  };

  const handleEnrollment = async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const token = user?.token;

    if (!user || !token) {
      alert("Please log in to enroll in this course.");
      return;
    }

    if (isEnrolled) {
      // Already enrolled, just redirect to progress page
      navigate(`/course-progress/${courseId}`);
      return;
    }

    // Show confirmation dialog for enrollment
    const confirmEnroll = window.confirm("Do you want to enroll in this course?");
    if (!confirmEnroll) {
      return;
    }

    setEnrolling(true);

    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          student: user._id, 
          course: courseId 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Successful enrollment
        setIsEnrolled(true);
        alert("Successfully enrolled in the course!");
        navigate(`/course-progress/${courseId}`);
      } else if (res.status === 400 && 
                 (data?.error?.includes("already enrolled") || 
                  data?.message?.includes("already enrolled"))) {
        // Already enrolled (backend detected it)
        setIsEnrolled(true);
        alert("You are already enrolled in this course!");
        navigate(`/course-progress/${courseId}`);
      } else {
        // Other errors
        alert(data.error || data.message || "Failed to enroll in the course.");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Something went wrong during enrollment. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleViewCourse = () => {
    navigate(`/course-progress/${courseId}`);
  };

  if (loading || !course) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center">
          <div className="spinner-border text-white mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-white">Loading course details...</h5>
          <p className="text-white-50">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  const totalLessons = course.sections?.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0) || 0;
  const totalSections = course.sections?.length || 0;

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div className="position-relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '6rem',
        paddingBottom: '4rem'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }}></div>
        
        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center mb-2">
                <span className={`badge rounded-pill px-3 py-2 me-3 ${course.level === 'Beginner' ? 'bg-success' : course.level === 'Intermediate' ? 'bg-warning' : 'bg-danger'}`} style={{ fontSize: '0.9rem' }}>
                  <i className="fas fa-layer-group me-1"></i>
                  {course.level}
                </span>
                <span className={`badge rounded-pill px-3 py-2 ${course.status === 'Free' ? 'bg-info' : 'bg-primary'}`} style={{ fontSize: '0.9rem' }}>
                  <i className="fas fa-tag me-1"></i>
                  {course.status}
                </span>
              </div>
              
              <h1 className="display-4 text-white fw-bold mb-4" style={{ lineHeight: '1.2' }}>
                {course.title}
              </h1>
              
              <p className="lead text-white-50 mb-4" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
                {course.description}
              </p>
              
              <div className="d-flex flex-wrap gap-4 text-white">
                <div className="d-flex align-items-center">
                  <i className="fas fa-play-circle me-2" style={{ fontSize: '1.2rem' }}></i>
                  <span><strong>{totalLessons}</strong> Lessons</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-list me-2" style={{ fontSize: '1.2rem' }}></i>
                  <span><strong>{totalSections}</strong> Sections</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-clock me-2" style={{ fontSize: '1.2rem' }}></i>
                  <span>Self-paced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     <div className="container py-5">
  <div className="row g-5">
    {/* LEFT SIDE: Image + Curriculum */}
    <div className="col-lg-8">
      {/* Course Image */}
      <div className="position-relative mb-5">
        <img
          src={course.image || "https://via.placeholder.com/800x400?text=No+Image"}
          alt={course.title}
          className="img-fluid rounded-4 shadow-lg w-100"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
          style={{
            background:
              "linear-gradient(45deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
          }}
        ></div>
      </div>

      {/* Course Curriculum Section */}
      <div className="bg-white rounded-4 shadow-sm p-4 mb-5">
        <div className="d-flex align-items-center mb-4">
          <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
            <i className="fas fa-book text-primary" style={{ fontSize: '1.5rem' }}></i>
          </div>
          <div>
            <h3 className="mb-1 fw-bold">Course Curriculum</h3>
            <p className="text-muted mb-0">Explore the comprehensive content structure</p>
          </div>
        </div>

        <div className="accordion accordion-flush" id="courseAccordion">
          {course.sections && course.sections.length > 0 ? (
            course.sections.map((section, idx) => (
              <div className="accordion-item border-0 mb-3" key={section._id || idx} style={{ background: '#f8f9ff', borderRadius: '12px', overflow: 'hidden' }}>
                <h2 className="accordion-header" id={`heading${idx}`}>
                  <button
                    className="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${idx}`}
                    aria-expanded="false"
                    aria-controls={`collapse${idx}`}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      borderRadius: '12px',
                      padding: '1.25rem'
                    }}
                  >
                    <div className="d-flex align-items-center w-100">
                      <div className="bg-primary bg-opacity-20 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <span className="text-primary fw-bold">{idx + 1}</span>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark">{section.title}</div>
                        <small className="text-muted">{section.lessons?.length || 0} lessons</small>
                      </div>
                    </div>
                  </button>
                </h2>
                <div id={`collapse${idx}`} className="accordion-collapse collapse" aria-labelledby={`heading${idx}`} data-bs-parent="#courseAccordion">
                  <div className="accordion-body pt-0">
                    <div className="border-start border-3 border-primary border-opacity-25 ps-4 ms-3">
                      {section.lessons && section.lessons.length > 0 ? (
                        section.lessons.map((lesson, lessonIdx) => (
                          <div className="d-flex align-items-center justify-content-between py-3 border-bottom border-light" key={lesson._id || lessonIdx}>
                            <div className="d-flex align-items-center">
                              <i className="fas fa-play-circle text-primary me-3"></i>
                              <span className="fw-medium">{lesson.title}</span>
                            </div>
                            <small className="text-muted bg-light px-2 py-1 rounded-pill">{lesson.duration || "Duration not specified"}</small>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted py-3">
                          <i className="fas fa-info-circle me-2"></i>No lessons in this section yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info border-0 rounded-3 d-flex align-items-center" style={{ background: '#e3f2fd' }}>
              <i className="fas fa-info-circle text-info me-3" style={{ fontSize: '1.5rem' }}></i>
              <div>
                <h6 className="mb-1 text-info">Content Coming Soon!</h6>
                <p className="mb-0 text-info-emphasis">Course content will be added soon. Stay tuned for updates!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* RIGHT SIDE: Enroll Card + Course Overview */}
    <div className="col-lg-3">
      <div className="sticky-top" style={{ top: "100px" }}>
        {/* Pricing Card */}
        <div className="card border-0 rounded-4 shadow-lg overflow-hidden mb-4"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}>
          <div className="card-body p-4 text-white">
            <div className="text-center mb-4">
              <div className="display-4 fw-bold mb-2">
                {course.status === "Paid" ? `₹${course.price || "Price not set"}` : "Free"}
              </div>
              {course.status === "Paid" && (
                <small className="text-white-50">One-time payment</small>
              )}
            </div>

            <div className="d-grid mb-4">
              {isEnrolled ? (
                <button
                  className="btn btn-light btn-lg rounded-3 fw-semibold py-3"
                  onClick={handleViewCourse}
                  disabled={enrolling}
                  style={{ color: "#667eea" }}
                >
                  <i className="fas fa-play-circle me-2"></i>
                  Continue Learning
                </button>
              ) : (
                <button
                  className="btn btn-light btn-lg rounded-3 fw-semibold py-3"
                  onClick={handleEnrollment}
                  disabled={enrolling}
                  style={{ color: "#667eea" }}
                >
                  {enrolling ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-graduation-cap me-2"></i>
                      Enroll Now
                    </>
                  )}
                </button>
              )}
            </div>

            {isEnrolled && (
              <div className="bg-white bg-opacity-20 rounded-3 p-3 text-center">
                <i className="fas fa-check-circle me-2"></i>
                <small>You're enrolled in this course!</small>
              </div>
            )}
          </div>
        </div>

        {/* Course Stats */}
        <div className="bg-white rounded-4 shadow-sm p-4">
          <h5 className="fw-bold mb-4 d-flex align-items-center">
            <i className="fas fa-chart-bar text-primary me-2"></i>
            Course Overview
          </h5>

          <div className="row g-3">
            <div className="col-6">
              <div className="text-center p-3 bg-primary bg-opacity-10 rounded-3">
                <div className="display-6 fw-bold text-primary mb-1">{totalLessons}</div>
                <small className="text-muted fw-medium">Total Lessons</small>
              </div>
            </div>
            <div className="col-6">
              <div className="text-center p-3 bg-success bg-opacity-10 rounded-3">
                <div className="display-6 fw-bold text-success mb-1">{totalSections}</div>
                <small className="text-muted fw-medium">Sections</small>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center">
              <div className="bg-info bg-opacity-20 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                <i className="fas fa-infinity text-info"></i>
              </div>
              <span className="fw-medium">Lifetime Access</span>
            </div>

            <div className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-20 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                <i className="fas fa-mobile-alt text-warning"></i>
              </div>
              <span className="fw-medium">Mobile Friendly</span>
            </div>

            <div className="d-flex align-items-center">
              <div className="bg-danger bg-opacity-20 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                <i className="fas fa-clock text-danger"></i>
              </div>
              <span className="fw-medium">Self-paced Learning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default ScourseDetail;