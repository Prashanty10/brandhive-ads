import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RoleRoute = ({ children, requiredRole }) => {
  const { activeRole, loading } = useAuth();

  if (loading) return null;

  if (requiredRole && activeRole && activeRole.toLowerCase() !== requiredRole.toLowerCase()) {
    if (activeRole.toLowerCase() === "seller") {
      return <Navigate to="/seller/dashboard" replace />;
    } else {
      return <Navigate to="/buyer/home" replace />;
    }
  }

  return children;
};

export default RoleRoute;
