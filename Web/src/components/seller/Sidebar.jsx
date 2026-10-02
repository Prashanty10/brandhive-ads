import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  CalendarCheck,
  User,
  LogOut,
  RefreshCw,
  Menu,
  X
} from "lucide-react";

const Sidebar = () => {
  const { switchRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSwitchToBuyer = async () => {
    try {
      await switchRole("buyer");
      setMobileOpen(false);
      navigate("/buyer/home");
    } catch (e) {
      alert("Failed to switch role");
    }
  };

  const navContent = (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
      <div>
        {/* Brand Header: Same Logo Style as Buyer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <Link
            to="/seller/dashboard"
            onClick={() => setMobileOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 8px", textDecoration: "none" }}
          >
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "800",
              fontSize: "20px",
              letterSpacing: "-1px",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
              flexShrink: 0
            }}>
              BH
            </div>
            <div>
              <span style={{ fontSize: "20px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.5px", display: "block", lineHeight: "1.1" }}>
                BrandHive
              </span>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#60A5FA", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                SELLER DASHBOARD
              </span>
            </div>
          </Link>

          {/* Close button inside mobile drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              display: "none",
              backgroundColor: "transparent",
              border: "none",
              color: "#A1A1AA",
              cursor: "pointer",
              padding: "4px"
            }}
            className="mobile-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <Link
            to="/seller/dashboard"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: isActive("/seller/dashboard") ? "800" : "500",
              color: isActive("/seller/dashboard") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: isActive("/seller/dashboard") ? "#1C1C21" : "transparent",
              border: isActive("/seller/dashboard") ? "1px solid #2C2C32" : "1px solid transparent",
              transition: "all 0.15s ease"
            }}
          >
            <LayoutDashboard size={18} color={isActive("/seller/dashboard") ? "#60A5FA" : "#A1A1AA"} />
            Dashboard
          </Link>

          <Link
            to="/seller/advertisements"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: isActive("/seller/advertisements") ? "800" : "500",
              color: isActive("/seller/advertisements") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: isActive("/seller/advertisements") ? "#1C1C21" : "transparent",
              border: isActive("/seller/advertisements") ? "1px solid #2C2C32" : "1px solid transparent",
              transition: "all 0.15s ease"
            }}
          >
            <Megaphone size={18} color={isActive("/seller/advertisements") ? "#60A5FA" : "#A1A1AA"} />
            My Ad Spaces
          </Link>

          <Link
            to="/seller/advertisements/create"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: isActive("/seller/advertisements/create") ? "800" : "500",
              color: isActive("/seller/advertisements/create") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: isActive("/seller/advertisements/create") ? "#1C1C21" : "transparent",
              border: isActive("/seller/advertisements/create") ? "1px solid #2C2C32" : "1px solid transparent",
              transition: "all 0.15s ease"
            }}
          >
            <PlusCircle size={18} color={isActive("/seller/advertisements/create") ? "#60A5FA" : "#A1A1AA"} />
            List New Ad Space
          </Link>

          <Link
            to="/seller/bookings"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: isActive("/seller/bookings") ? "800" : "500",
              color: isActive("/seller/bookings") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: isActive("/seller/bookings") ? "#1C1C21" : "transparent",
              border: isActive("/seller/bookings") ? "1px solid #2C2C32" : "1px solid transparent",
              transition: "all 0.15s ease"
            }}
          >
            <CalendarCheck size={18} color={isActive("/seller/bookings") ? "#60A5FA" : "#A1A1AA"} />
            Campaign Requests
          </Link>

          <Link
            to="/seller/profile"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: isActive("/seller/profile") ? "800" : "500",
              color: isActive("/seller/profile") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: isActive("/seller/profile") ? "#1C1C21" : "transparent",
              border: isActive("/seller/profile") ? "1px solid #2C2C32" : "1px solid transparent",
              transition: "all 0.15s ease"
            }}
          >
            <User size={18} color={isActive("/seller/profile") ? "#60A5FA" : "#A1A1AA"} />
            Business Profile
          </Link>
        </nav>
      </div>

      {/* Footer Controls */}
      <div style={{ borderTop: "1px solid #1C1C21", paddingTop: "16px" }}>
        <button
          onClick={handleSwitchToBuyer}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "11px 14px",
            borderRadius: "12px",
            backgroundColor: "#1C1C21",
            color: "#60A5FA",
            fontSize: "13px",
            fontWeight: "700",
            border: "1px solid #2C2C32",
            cursor: "pointer",
            marginBottom: "10px",
            transition: "all 0.15s ease"
          }}
        >
          <RefreshCw size={16} color="#60A5FA" />
          Switch to Buyer Mode
        </button>

        <button
          onClick={() => {
            setMobileOpen(false);
            logout();
            navigate("/");
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 14px",
            borderRadius: "12px",
            backgroundColor: "transparent",
            color: "#EF4444",
            fontSize: "13px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          <LogOut size={16} color="#EF4444" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sticky Top Navigation Bar for Seller */}
      <div
        className="mobile-seller-bar"
        style={{
          display: "none",
          position: "sticky",
          top: 0,
          zIndex: 90,
          backgroundColor: "#000000",
          borderBottom: "1px solid #1C1C21",
          padding: "12px 16px",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Link to="/seller/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "16px"
          }}>
            BH
          </div>
          <span style={{ fontSize: "16px", fontWeight: "800", color: "#FFFFFF" }}>
            Seller Portal
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            backgroundColor: "#1C1C21",
            border: "1px solid #2C2C32",
            color: "#FFFFFF",
            borderRadius: "8px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 98
          }}
        />
      )}

      {/* Sidebar Container (Desktop Sticky Sidebar & Mobile Drawer) */}
      <aside
        className={`seller-sidebar-container ${mobileOpen ? "mobile-drawer-open" : ""}`}
        style={{
          width: "260px",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          height: "100vh",
          position: "sticky",
          top: 0,
          padding: "24px 16px",
          borderRight: "1px solid #1C1C21",
          flexShrink: 0
        }}
      >
        {navContent}
      </aside>

      <style>{`
        @media (max-width: 1023px) {
          .mobile-seller-bar {
            display: flex !important;
          }
          .seller-sidebar-container {
            position: fixed !important;
            top: 0 !important;
            left: -280px !important;
            bottom: 0 !important;
            z-index: 99 !important;
            transition: left 0.25s ease-in-out !important;
            box-shadow: 10px 0 30px rgba(0,0,0,0.5) !important;
          }
          .seller-sidebar-container.mobile-drawer-open {
            left: 0 !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
