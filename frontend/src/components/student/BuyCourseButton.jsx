import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BuyCourseButton = ({ courseId }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnroll = async () => {
    if (!window.confirm("Do you want to enroll in this course?")) return;
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const token = user?.token;
    if (!user || !token) {
      alert("Please log in to enroll.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ student: user._id, course: courseId }),
      });
      if (res.ok) {
        alert("Enrolled successfully!");
        navigate(`/course-progress/${courseId}`);
      } else {
        const data = await res.json();
        alert(data.error || data.message || "Enrollment failed.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <button
      className="btn btn-success w-100"
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading ? "Enrolling..." : "Enroll & View Course"}
    </button>
  );
};

export default BuyCourseButton;