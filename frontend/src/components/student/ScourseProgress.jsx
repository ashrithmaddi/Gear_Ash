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

  if (!course) return <div>Loading...</div>;

  const section = course.sections[selectedSection];
  const lesson = section?.lessons?.[selectedLesson];

  // Detect file type for rendering
  const renderContent = () => {
    if (!lesson) return <div>No lesson selected.</div>;
    if (lesson.videoUrl) {
      return (
        <div className="ratio ratio-16x9 mb-3">
          <iframe
            src={lesson.videoUrl}
            title={lesson.title}
            allowFullScreen
          ></iframe>
        </div>
      );
    }
    if (lesson.pdfUrl) {
      return (
        <iframe
          src={lesson.pdfUrl}
          title={lesson.title}
          width="100%"
          height="500px"
        ></iframe>
      );
    }
    return <div>No content available.</div>;
  };

  return (
    <div className="container my-5">
      <div className="row">
        {/* Main content */}
        <div className="col-md-8">
          <h4>{lesson?.title || "Select a lesson"}</h4>
          {renderContent()}
        </div>
        {/* Sidebar: Sections/Lessons */}
        <div className="col-md-4">
          <h5>Course Content</h5>
          <div className="accordion" id="progressAccordion">
            {course.sections.map((sec, secIdx) => (
              <div className="accordion-item" key={sec._id || secIdx}>
                <h2 className="accordion-header" id={`progressHeading${secIdx}`}>
                  <button
                    className={`accordion-button ${selectedSection === secIdx ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => setSelectedSection(secIdx)}
                  >
                    {sec.title}
                  </button>
                </h2>
                <div
                  className={`accordion-collapse collapse ${selectedSection === secIdx ? "show" : ""}`}
                  aria-labelledby={`progressHeading${secIdx}`}
                  data-bs-parent="#progressAccordion"
                >
                  <div className="accordion-body p-0">
                    <ul className="list-group">
                      {sec.lessons?.map((les, lesIdx) => (
                        <li
                          key={les._id || lesIdx}
                          className={`list-group-item ${selectedLesson === lesIdx && selectedSection === secIdx ? "active" : ""}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedSection(secIdx);
                            setSelectedLesson(lesIdx);
                          }}
                        >
                          {les.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScourseProgress;