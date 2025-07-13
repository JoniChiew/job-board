// Protected route component for authenticated users
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../AppContext.js";

function ProtectedRoute({ children, role }) {
  const { user } = useContext(AppContext);
  const token = localStorage.getItem("token");

  // Redirect to login if not authenticated
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // Redirect to login if role doesn't match
  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
