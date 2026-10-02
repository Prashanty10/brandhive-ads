import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";

// Pages
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OtpVerifyPage from "./pages/auth/OtpVerifyPage";
import ProfileSetupPage from "./pages/auth/ProfileSetupPage";

// Buyer Pages
import BuyerHomePage from "./pages/buyer/BuyerHomePage";
import DiscoverPage from "./pages/buyer/DiscoverPage";
import NearbyPage from "./pages/buyer/NearbyPage";
import MapViewPage from "./pages/buyer/MapViewPage";
import BuyerBookingsPage from "./pages/buyer/BuyerBookingsPage";
import BuyerProfilePage from "./pages/buyer/BuyerProfilePage";

// Seller Pages
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import SellerAdvertisementsPage from "./pages/seller/SellerAdvertisementsPage";
import CreateAdvertisementPage from "./pages/seller/CreateAdvertisementPage";
import SellerBookingsPage from "./pages/seller/SellerBookingsPage";
import SellerProfilePage from "./pages/seller/SellerProfilePage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public / Welcome */}
          <Route path="/" element={<WelcomePage />} />

          {/* Auth Onboarding */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/verify-otp" element={<OtpVerifyPage />} />
          <Route
            path="/auth/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
          />

          {/* Buyer Application Routes */}
          <Route
            path="/buyer/home"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="buyer">
                  <BuyerHomePage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/discover"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="buyer">
                  <DiscoverPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/nearby"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="buyer">
                  <NearbyPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/map"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="buyer">
                  <MapViewPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/bookings"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="buyer">
                  <BuyerBookingsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/profile"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="buyer">
                  <BuyerProfilePage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Seller Application Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="seller">
                  <SellerDashboardPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/advertisements"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="seller">
                  <SellerAdvertisementsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/advertisements/create"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="seller">
                  <CreateAdvertisementPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/bookings"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="seller">
                  <SellerBookingsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/profile"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="seller">
                  <SellerProfilePage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
