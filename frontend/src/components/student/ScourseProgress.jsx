import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ScourseProgress = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(0);

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => setCourse(data));
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}>
        <div className="text-center">
          <div className="spinner-border text-white mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-white mb-2">Loading Course Content...</h5>
          <p className="text-white-50">Preparing your learning experience</p>
        </div>
      </div>
    );
  }

  const section = course.sections[selectedSection];
  const lesson = section?.lessons?.[selectedLesson];
  // If lesson.videoUrl is a YouTube watch URL, convert it to embed format
const getEmbedUrl = (url) => {
  // Desktop YouTube
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Mobile YouTube
  if (url.includes("m.youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Share links (youtu.be)
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};
  // Calculate progress
  const totalLessons = course.sections.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0);
  const currentLessonIndex = course.sections.slice(0, selectedSection).reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0) + selectedLesson + 1;
  const progressPercentage = totalLessons > 0 ? (currentLessonIndex / totalLessons) * 100 : 0;

  // Detect file type for rendering
  const renderContent = () => {
    if (!lesson) {
      return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
              <i className="fas fa-play text-muted" style={{ fontSize: '2rem' }}></i>
            </div>
            <h5 className="text-muted mb-2">Select a lesson to start learning</h5>
            <p className="text-muted">Choose from the course content on the right</p>
          </div>
        </div>
      );
    }

   // filepath: c:\Users\Lenovo\OneDrive\Documents\GearupNew\Gearup4\frontend\src\components\student\ScourseProgress.jsx
if (lesson.videoUrl) {
  return (
    <div className="position-relative">
      <div className="ratio ratio-16x9 mb-3 rounded-4 overflow-hidden shadow-lg">
        <iframe
          src={getEmbedUrl(lesson.videoUrl)}
          title={lesson.title}
          allowFullScreen
          className="rounded-4"
          style={{ border: 'none' }}
        ></iframe>
      </div>
      <div className="position-absolute top-0 end-0 m-3">
        <span className="badge bg-dark bg-opacity-75 rounded-pill px-3 py-2">
          <i className="fas fa-video me-1"></i>
          Video Lesson
        </span>
      </div>
    </div>
  );
}

    if (lesson.pdfUrl) {
      return (
        <div className="position-relative">
          <div className="rounded-4 overflow-hidden shadow-lg mb-3" style={{ height: '500px' }}>
            <iframe
              src={lesson.pdfUrl}
              title={lesson.title}
              width="100%"
              height="100%"
              className="border-0"
            ></iframe>
          </div>
          <div className="position-absolute top-0 end-0 m-3">
            <span className="badge bg-danger bg-opacity-90 rounded-pill px-3 py-2">
              <i className="fas fa-file-pdf me-1"></i>
              PDF Document
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="d-flex align-items-center justify-content-center bg-light rounded-4" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="bg-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '80px', height: '80px' }}>
            <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '2rem' }}></i>
          </div>
          <h5 className="text-muted mb-2">No content available</h5>
          <p className="text-muted">This lesson doesn't have any content yet</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
      minHeight: '100vh' 
    }}>
      {/* Header Section */}
      <div className="bg-white shadow-sm border-bottom">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center mb-2">
                <div className="bg-primary bg-opacity-10 rounded-3 p-2 me-3">
                  <i className="fas fa-graduation-cap text-primary"></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">{course.title}</h4>
                  <small className="text-muted">Continue your learning journey</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-end">
                <div className="d-flex align-items-center justify-content-end mb-2">
                  <span className="me-2 fw-semibold text-primary">{Math.round(progressPercentage)}% Complete</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-gradient" 
                    role="progressbar" 
                    style={{ 
                      width: `${progressPercentage}%`,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)'
                    }}
                  ></div>
                </div>
                <small className="text-muted">Lesson {currentLessonIndex} of {totalLessons}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="m-4 py-4">
        <div className="row g-4">
          {/* Main content */}
          <div className="col-lg-8">
            <div className="bg-white rounded-4 shadow-sm overflow-hidden">
              {/* Lesson Header */}
              <div className="p-4 border-bottom" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="text-white">
                  <div className="d-flex align-items-center mb-2">
                    <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-1 me-3">
                      Section {selectedSection + 1}
                    </span>
                    <small className="text-white-50">
                      {section?.title}
                    </small>
                  </div>
                  <h3 className="mb-0 fw-bold">
                    {lesson?.title || "Select a lesson to start"}
                  </h3>
                  {lesson?.duration && (
                    <div className="d-flex align-items-center mt-2">
                      <i className="fas fa-clock me-2"></i>
                      <span>{lesson.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4">
                {renderContent()}
              </div>

              {/* Navigation Footer */}
              {lesson && (
                <div className="p-4 border-top bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <button 
                      className="btn btn-outline-primary rounded-pill px-4"
                      onClick={() => {
                        if (selectedLesson > 0) {
                          setSelectedLesson(selectedLesson - 1);
                        } else if (selectedSection > 0) {
                          const prevSection = course.sections[selectedSection - 1];
                          setSelectedSection(selectedSection - 1);
                          setSelectedLesson((prevSection?.lessons?.length || 1) - 1);
                        }
                      }}
                      disabled={selectedSection === 0 && selectedLesson === 0}
                    >
                      <i className="fas fa-chevron-left me-2"></i>
                      Previous
                    </button>

                    <div className="text-center">
                      <small className="text-muted">
                        Lesson {selectedLesson + 1} of {section?.lessons?.length || 0}
                      </small>
                    </div>

                    <button 
                      className="btn btn-primary rounded-pill px-4"
                      onClick={() => {
                        const currentSectionLessons = section?.lessons?.length || 0;
                        if (selectedLesson < currentSectionLessons - 1) {
                          setSelectedLesson(selectedLesson + 1);
                        } else if (selectedSection < course.sections.length - 1) {
                          setSelectedSection(selectedSection + 1);
                          setSelectedLesson(0);
                        }
                      }}
                      disabled={
                        selectedSection === course.sections.length - 1 && 
                        selectedLesson === (section?.lessons?.length || 1) - 1
                      }
                    >
                      Next
                      <i className="fas fa-chevron-right ms-2"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Sections/Lessons */}
          <div className="col-lg-3">
            <div className="bg-white rounded-4 shadow-sm overflow-hidden sticky-top" style={{ top: '100px' }}>
              <div className="p-4 border-bottom" style={{ background: '#f8f9ff' }}>
                <h5 className="mb-0 fw-bold d-flex align-items-center">
                  <i className="fas fa-list-ul text-primary me-2"></i>
                  Course Content
                </h5>
              </div>

              <div className="accordion accordion-flush" id="progressAccordion" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {course.sections.map((sec, secIdx) => (
                  <div className="accordion-item border-0" key={sec._id || secIdx}>
                    <h2 className="accordion-header" id={`progressHeading${secIdx}`}>
                      <button
                        className={`accordion-button fw-semibold ${selectedSection === secIdx ? "" : "collapsed"}`}
                        type="button"
                        onClick={() => setSelectedSection(secIdx)}
                        style={{
                          background: selectedSection === secIdx ? '#f0f4ff' : 'transparent',
                          border: 'none',
                          boxShadow: 'none',
                          color: selectedSection === secIdx ? '#667eea' : '#333'
                        }}
                      >
                        <div className="d-flex align-items-center w-100">
                          <div 
                            className={`rounded-circle me-3 d-flex align-items-center justify-content-center ${
                              selectedSection === secIdx ? 'bg-primary text-white' : 'bg-light text-muted'
                            }`} 
                            style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                          >
                            {secIdx + 1}
                          </div>
                          <div className="flex-grow-1 text-start">
                            <div className="fw-bold">{sec.title}</div>
                            <small className={selectedSection === secIdx ? 'text-primary' : 'text-muted'}>
                              {sec.lessons?.length || 0} lessons
                            </small>
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse collapse ${selectedSection === secIdx ? "show" : ""}`}
                      aria-labelledby={`progressHeading${secIdx}`}
                      data-bs-parent="#progressAccordion"
                    >
                      <div className="accordion-body p-0">
                        <div className="list-group list-group-flush">
                          {sec.lessons?.map((les, lesIdx) => (
                            <button
                              key={les._id || lesIdx}
                              className={`list-group-item list-group-item-action border-0 py-3 ${
                                selectedLesson === lesIdx && selectedSection === secIdx 
                                  ? "active" 
                                  : ""
                              }`}
                              style={{
                                cursor: "pointer",
                                background: selectedLesson === lesIdx && selectedSection === secIdx 
                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                  : 'transparent',
                                color: selectedLesson === lesIdx && selectedSection === secIdx 
                                  ? 'white' 
                                  : '#333',
                                border: 'none'
                              }}
                              onClick={() => {
                                setSelectedSection(secIdx);
                                setSelectedLesson(lesIdx);
                              }}
                            >
                              <div className="d-flex align-items-center">
                                <div className={`me-3 ${
                                  selectedLesson === lesIdx && selectedSection === secIdx 
                                    ? 'text-white' 
                                    : 'text-primary'
                                }`}>
                                  {les.videoUrl ? (
                                    <i className="fas fa-play-circle"></i>
                                  ) : les.pdfUrl ? (
                                    <i className="fas fa-file-pdf"></i>
                                  ) : (
                                    <i className="fas fa-file-alt"></i>
                                  )}
                                </div>
                                <div className="flex-grow-1 text-start">
                                  <div className="fw-medium">{les.title}</div>
                                  {les.duration && (
                                    <small className={`${
                                      selectedLesson === lesIdx && selectedSection === secIdx 
                                        ? 'text-white-50' 
                                        : 'text-muted'
                                    }`}>
                                      <i className="fas fa-clock me-1"></i>
                                      {les.duration}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScourseProgress;