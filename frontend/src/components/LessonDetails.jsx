import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://gearash-production.up.railway.app";

function LessonDetails() {
  const { courseId, sectionId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
        const course = res.data.course || res.data;
        const section = (course.sections || []).find(s => s._id === sectionId);
        const foundLesson = (section?.lessons || []).find(l => l._id === lessonId);
        setLesson(foundLesson);
      } catch (err) {
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [courseId, sectionId, lessonId]);

  if (loading) return <div>Loading...</div>;
  if (!lesson) return <div className="alert alert-danger">Lesson not found.</div>;

  return (
    <div className="container my-4">
      {/* Go Back Button */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}`)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Section
        </button>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{lesson.title}</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/edit`)}
        >
          <i className="bi bi-pencil me-1"></i>
          Edit Lesson
        </button>
      </div>
      <p><strong>Type:</strong> {lesson.type}</p>
      <p><strong>Description:</strong> {lesson.description}</p>
      {lesson.type === "Text" && (
        <div className="border p-2 rounded bg-light">{lesson.textContent}</div>
      )}
      {lesson.type === "Video" && lesson.videoUrl && (
        <div>
          {/* Google Drive video embed */}
          {lesson.videoUrl.includes("drive.google.com") ? (
            <div className="ratio ratio-16x9 mb-2">
              <iframe
                src={
                  lesson.videoUrl.includes("/view")
                    ? lesson.videoUrl.replace("/view", "/preview")
                    : lesson.videoUrl
                }
                title={lesson.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
                frameBorder="0"
                width="100%"
                height="400"
              />
            </div>
          ) : lesson.videoUrl.includes("youtube.com") || lesson.videoUrl.includes("youtu.be") ? (
            <div className="ratio ratio-16x9 mb-2">
              <iframe
                src={
                  lesson.videoUrl.includes("watch?v=")
                    ? lesson.videoUrl.replace("watch?v=", "embed/")
                    : lesson.videoUrl.replace("youtu.be/", "youtube.com/embed/")
                }
                title={lesson.title}
                allowFullScreen
                frameBorder="0"
                width="100%"
                height="400"
              />
            </div>
          ) : (
            <video controls width="100%" style={{ maxWidth: 700 }}>
              <source src={lesson.videoUrl} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
      {lesson.type === "Image" && lesson.imageUrl && (
        <img src={lesson.imageUrl} alt={lesson.title} className="img-fluid rounded" />
      )}
      {["PDF", "Document", "Excel"].includes(lesson.type) && lesson.fileUrl && (
        <div>
          <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer" download>
            Download {lesson.type}
          </a>
        </div>
      )}
    </div>
  );
}

export default LessonDetails;

// This file should display lesson details as a separate page.
