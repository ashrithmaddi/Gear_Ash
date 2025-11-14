import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userAdminContextObj } from "../context/UserAdmin";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(userAdminContextObj);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;