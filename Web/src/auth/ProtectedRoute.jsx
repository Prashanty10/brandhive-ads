import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isVerified, isProfileCompleted, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7F7F5",
        color: "#111827",
        fontFamily: "sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{
            width: "36px",
            height: "36px",
            border: "3px solid #E5E7EB",
            borderTopColor: "#111827",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px auto"
          }} />
          <p style={{ color: "#6B7280", fontSize: "14px", fontWeight: "500" }}>Loading BrandHive...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!isVerified && location.pathname !== "/auth/verify-otp") {
    return <Navigate to="/auth/verify-otp" replace />;
  }

  if (isVerified && !isProfileCompleted && location.pathname !== "/auth/profile-setup") {
    return <Navigate to="/auth/profile-setup" replace />;
  }

  return children;
};

export default ProtectedRoute;
