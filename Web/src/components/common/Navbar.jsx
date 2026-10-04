import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  Search,
  MapPin,
  User,
  LogOut,
  RefreshCw,
  LayoutDashboard,
  Compass,
  Bookmark,
  ChevronDown,
  Menu,
  X,
  Building2,
  Home,
  Map,
  Clock,
  Phone
} from "lucide-react";

const Navbar = ({ onOpenAuthModal }) => {
  const { user, isAuthenticated, activeRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleSwitchRole = async () => {
    const targetRole = activeRole === "seller" ? "buyer" : "seller";
    const hasTargetRole = user?.roles && Array.isArray(user.roles) && user.roles.includes(targetRole);

    setMobileMenuOpen(false);
    setDropdownOpen(false);

    if (!hasTargetRole) {
      if (targetRole === "seller") {
        alert(
          `Register as Seller Required:\n\nYou are currently registered only as a Buyer. To switch to Seller mode, please select 'I am a Space Owner' (Seller) on the registration screen and register using your existing email (${user?.email || ""}), username (${user?.username || ""}), and password.`
        );
        navigate("/auth/register", {
          state: {
            role: "seller",
            email: user?.email,
            username: user?.username,
            fromBuyerSwitch: true,
          },
        });
      } else {
        alert(
          `Register as Buyer Required:\n\nYou are currently registered only as a Seller. To switch to Buyer mode, please select 'I am an Advertiser' (Buyer) on the registration screen and register using your existing email (${user?.email || ""}), username (${user?.username || ""}), and password.`
        );
        navigate("/auth/register", {
          state: {
            role: "buyer",
            email: user?.email,
            username: user?.username,
            fromSellerSwitch: true,
          },
        });
      }
      return;
    }

    try {
      setSwitching(true);
      await switchRole(targetRole);
      if (targetRole === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/buyer/home");
      }
    } catch (err) {
      alert(err?.message || `Failed to switch to ${targetRole} mode.`);
    } finally {
      setSwitching(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #E5E7EB",
      padding: "0 20px",
      height: "72px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      {/* Left: Brand Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to={isAuthenticated ? (activeRole === "seller" ? "/seller/dashboard" : "/buyer/home") : "/"}
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            backgroundColor: "#111827",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "20px",
            letterSpacing: "-1px"
          }}>
            BH
          </div>
          <span style={{ fontSize: "20px", fontWeight: "800", color: "#111827", letterSpacing: "-0.5px" }}>
            BrandHive
          </span>
        </Link>
      </div>

      {/* Center Navigation Bar (Desktop Links) */}
      {isAuthenticated && activeRole !== "seller" && (
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", flex: 1 }} className="desktop-nav">
          <Link to="/buyer/home" style={{
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: isActive("/buyer/home") ? "700" : "500",
            color: isActive("/buyer/home") ? "#111827" : "#6B7280",
            backgroundColor: isActive("/buyer/home") ? "#F3F4F6" : "transparent"
          }}>
            Home
          </Link>
          <Link to="/buyer/discover" style={{
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: isActive("/buyer/discover") ? "700" : "500",
            color: isActive("/buyer/discover") ? "#111827" : "#6B7280",
            backgroundColor: isActive("/buyer/discover") ? "#F3F4F6" : "transparent"
          }}>
            Discover
          </Link>
          <Link to="/buyer/bookings" style={{
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: isActive("/buyer/bookings") ? "700" : "500",
            color: isActive("/buyer/bookings") ? "#111827" : "#6B7280",
            backgroundColor: isActive("/buyer/bookings") ? "#F3F4F6" : "transparent"
          }}>
            Booking
          </Link>
          <Link to="/buyer/nearby" style={{
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: isActive("/buyer/nearby") ? "700" : "500",
            color: isActive("/buyer/nearby") ? "#111827" : "#6B7280",
            backgroundColor: isActive("/buyer/nearby") ? "#F3F4F6" : "transparent"
          }}>
            Nearby
          </Link>
        </nav>
      )}

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isAuthenticated ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px 6px 6px",
                borderRadius: "9999px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                cursor: "pointer"
              }}
            >
              <img
                src={user?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"}
                alt="Profile"
                style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ textAlign: "left" }} className="desktop-only">
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827", display: "block", lineHeight: "1.2" }}>
                  {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "User Profile"}
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#2563EB", textTransform: "capitalize" }}>
                  {activeRole} Mode
                </span>
              </div>
              <ChevronDown size={14} color="#6B7280" />
            </button>

            {dropdownOpen && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "50px",
                width: "240px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.12)",
                padding: "8px",
                zIndex: 200
              }}>
                <div style={{ padding: "12px", borderBottom: "1px solid #F3F4F6", marginBottom: "4px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>
                    {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Account"}
                  </p>
                  <p style={{ fontSize: "12px", color: "#6B7280", wordBreak: "break-all" }}>
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(activeRole === "seller" ? "/seller/profile" : "/buyer/profile");
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "transparent",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#111827",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F9FAFB"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <User size={16} color="#6B7280" />
                  View Profile
                </button>

                <button
                  onClick={handleSwitchRole}
                  disabled={switching}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "transparent",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#2563EB",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EFF6FF"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <RefreshCw size={16} color="#2563EB" className={switching ? "spin" : ""} />
                  Switch to {activeRole === "seller" ? "Buyer" : "Seller"}
                </button>

                <div style={{ height: "1px", backgroundColor: "#F3F4F6", margin: "4px 0" }} />

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                    navigate("/");
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "transparent",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#EF4444",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FEF2F2"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <LogOut size={16} color="#EF4444" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="desktop-only">
            <button
              onClick={() => onOpenAuthModal ? onOpenAuthModal("login") : navigate("/auth/login")}
              className="btn btn-secondary btn-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuthModal ? onOpenAuthModal("register") : navigate("/auth/register")}
              className="btn btn-primary btn-sm"
            >
              Create Account
            </button>
          </div>
        )}

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
            cursor: "pointer"
          }}
          className="mobile-hamburger-btn"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} color="#111827" /> : <Menu size={20} color="#111827" />}
        </button>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed",
          top: "72px",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#FFFFFF",
          zIndex: 99,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "auto",
          borderTop: "1px solid #E5E7EB"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {isAuthenticated && activeRole !== "seller" && (
              <>
                <Link
                  to="/buyer/home"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: isActive("/buyer/home") ? "700" : "500",
                    color: isActive("/buyer/home") ? "#111827" : "#4B5563",
                    backgroundColor: isActive("/buyer/home") ? "#F3F4F6" : "transparent"
                  }}
                >
                  <Home size={18} color={isActive("/buyer/home") ? "#2563EB" : "#6B7280"} />
                  Home
                </Link>

                <Link
                  to="/buyer/discover"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: isActive("/buyer/discover") ? "700" : "500",
                    color: isActive("/buyer/discover") ? "#111827" : "#4B5563",
                    backgroundColor: isActive("/buyer/discover") ? "#F3F4F6" : "transparent"
                  }}
                >
                  <Compass size={18} color={isActive("/buyer/discover") ? "#2563EB" : "#6B7280"} />
                  Discover
                </Link>

                <Link
                  to="/buyer/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: isActive("/buyer/bookings") ? "700" : "500",
                    color: isActive("/buyer/bookings") ? "#111827" : "#4B5563",
                    backgroundColor: isActive("/buyer/bookings") ? "#F3F4F6" : "transparent"
                  }}
                >
                  <Clock size={18} color={isActive("/buyer/bookings") ? "#2563EB" : "#6B7280"} />
                  Booking
                </Link>

                <Link
                  to="/buyer/nearby"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: isActive("/buyer/nearby") ? "700" : "500",
                    color: isActive("/buyer/nearby") ? "#111827" : "#4B5563",
                    backgroundColor: isActive("/buyer/nearby") ? "#F3F4F6" : "transparent"
                  }}
                >
                  <MapPin size={18} color={isActive("/buyer/nearby") ? "#2563EB" : "#6B7280"} />
                  Nearby
                </Link>
              </>
            )}

            {isAuthenticated && activeRole === "seller" && (
              <>
                <Link
                  to="/seller/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#111827"
                  }}
                >
                  <LayoutDashboard size={18} color="#2563EB" />
                  Seller Dashboard
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal ? onOpenAuthModal("login") : navigate("/auth/login");
                  }}
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal ? onOpenAuthModal("register") : navigate("/auth/register");
                  }}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "16px", marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(activeRole === "seller" ? "/seller/profile" : "/buyer/profile");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  backgroundColor: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111827",
                  cursor: "pointer"
                }}
              >
                <User size={18} color="#4B5563" />
                View Profile ({user?.firstName || "Account"})
              </button>

              <button
                onClick={handleSwitchRole}
                disabled={switching}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #BFDBFE",
                  backgroundColor: "#EFF6FF",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#2563EB",
                  cursor: "pointer"
                }}
              >
                <RefreshCw size={18} color="#2563EB" className={switching ? "spin" : ""} />
                Switch to {activeRole === "seller" ? "Buyer" : "Seller"} Mode
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate("/");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#FEF2F2",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#EF4444",
                  cursor: "pointer"
                }}
              >
                <LogOut size={18} color="#EF4444" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
