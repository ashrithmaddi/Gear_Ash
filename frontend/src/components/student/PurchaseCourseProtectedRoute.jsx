import React from "react";
import { Navigate, useParams } from "react-router-dom";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  // Replace with your logic to check if the course is purchased
  const isPurchased = true; // Set this based on your API/data

  if (!isPurchased) {
    return <Navigate to={`/course-detail/${courseId}`} />;
  }
  return children;
};

export default PurchaseCourseProtectedRoute;