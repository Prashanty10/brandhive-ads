import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Megaphone,
  Store,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowLeft
} from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("buyer"); // 'buyer' | 'seller'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await login(email.trim(), password, role);

      if (res?.user) {
        const user = res.user;
        if (!user.isVerified) {
          sessionStorage.setItem("pendingOtpEmail", email.trim());
          navigate("/auth/verify-otp", { state: { email: email.trim() } });
        } else if (!user.isProfileCompleted && (!user.firstName || !user.lastName)) {
          navigate("/auth/profile-setup");
        } else {
          const userRole = user.activeRole || user.role || role;
          if (userRole === "seller") {
            navigate("/seller/dashboard");
          } else {
            navigate("/buyer/home");
          }
        }
      }
    } catch (err) {
      const errMsg = err?.message || "";
      if (errMsg.toLowerCase().includes("email not verified") || errMsg.toLowerCase().includes("verify your email")) {
        sessionStorage.setItem("pendingOtpEmail", email.trim());
        navigate("/auth/verify-otp", { state: { email: email.trim() } });
        return;
      }
      setError(errMsg || "Invalid email or password. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F5", display: "flex", flexDirection: "column" }}>
      {/* Header Bar */}
      <header style={{ height: "72px", borderBottom: "1px solid #E5E7EB", backgroundColor: "#FFFFFF", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            backgroundColor: "#111827",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "18px"
          }}>
            BH
          </div>
          <span style={{ fontSize: "19px", fontWeight: "800", color: "#111827" }}>BrandHive</span>
        </Link>

        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "#6B7280", textDecoration: "none" }}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </header>

      {/* Main Content Split Layout */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{
          maxWidth: "1000px",
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.07)",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          overflow: "hidden"
        }} className="auth-grid">

          {/* Left Branding Showcase Side */}
          <div style={{
            backgroundColor: "#111827",
            color: "#FFFFFF",
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Background Glow */}
            <div style={{
              position: "absolute",
              top: "-20%",
              left: "-20%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              backgroundColor: "rgba(37, 99, 235, 0.25)",
              filter: "blur(70px)",
              pointerEvents: "none"
            }} />

            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#93C5FD",
                fontSize: "12px",
                fontWeight: "700",
                marginBottom: "28px"
              }}>
                <Sparkles size={14} />
                <span>SIGN IN TO YOUR ACCOUNT</span>
              </div>

              <h2 style={{ fontSize: "28px", fontWeight: "800", lineHeight: "1.2", marginBottom: "16px", letterSpacing: "-0.5px" }}>
                Connect Brands With Spaces That Get Seen.
              </h2>
              <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.6", marginBottom: "32px" }}>
                Access India's premier marketplace for physical billboards, digital screens, transit wraps, and promotional channels.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Building2 size={18} color="#60A5FA" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "700" }}>Verified Media Inventory</h4>
                    <p style={{ fontSize: "12px", color: "#9CA3AF" }}>Direct access to space owners without middleman markups</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldCheck size={18} color="#34D399" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "700" }}>Seamless Campaign Booking</h4>
                    <p style={{ fontSize: "12px", color: "#9CA3AF" }}>Schedule campaign dates and track your bookings in real time</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: "32px", borderTop: "1px solid rgba(255, 255, 255, 0.1)", marginTop: "32px" }}>
              <p style={{ fontSize: "12px", color: "#6B7280" }}>
                © {new Date().getFullYear()} BrandHive Platform. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right Form Card Side */}
          <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }} className="auth-form-side">
            <div style={{ marginBottom: "28px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#111827", marginBottom: "6px" }}>
                Welcome Back
              </h3>
              <p style={{ fontSize: "14px", color: "#6B7280" }}>
                Select your account role and enter your credentials to sign in.
              </p>
            </div>

            {/* Role Selection Switcher */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              backgroundColor: "#F3F4F6",
              padding: "4px",
              borderRadius: "14px",
              marginBottom: "24px"
            }}>
              <button
                type="button"
                onClick={() => setRole("buyer")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: role === "buyer" ? "#FFFFFF" : "transparent",
                  color: role === "buyer" ? "#111827" : "#6B7280",
                  fontWeight: role === "buyer" ? "700" : "500",
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: role === "buyer" ? "0 2px 8px rgba(0,0,0,0.06)" : "none"
                }}
              >
                <Megaphone size={16} color={role === "buyer" ? "#2563EB" : "#6B7280"} />
                <span>Advertiser (Buyer)</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("seller")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: role === "seller" ? "#FFFFFF" : "transparent",
                  color: role === "seller" ? "#111827" : "#6B7280",
                  fontWeight: role === "seller" ? "700" : "500",
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: role === "seller" ? "0 2px 8px rgba(0,0,0,0.06)" : "none"
                }}
              >
                <Store size={16} color={role === "seller" ? "#059669" : "#6B7280"} />
                <span>Space Owner (Seller)</span>
              </button>
            </div>

            {/* Error Alert Banner */}
            {error && (
              <div style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                color: "#991B1B",
                borderRadius: "12px",
                padding: "12px 14px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px"
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px", display: "block" }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} color="#9CA3AF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      height: "46px",
                      paddingLeft: "42px",
                      paddingRight: "14px",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      fontSize: "14px",
                      color: "#111827",
                      backgroundColor: "#F9FAFB",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px", display: "block" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={18} color="#9CA3AF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      height: "46px",
                      paddingLeft: "42px",
                      paddingRight: "42px",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      fontSize: "14px",
                      color: "#111827",
                      backgroundColor: "#F9FAFB",
                      outline: "none"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#6B7280" }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#111827",
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "8px",
                  boxShadow: "0 4px 12px rgba(17, 24, 39, 0.2)"
                }}
              >
                <span>{loading ? "Signing In..." : "Sign In to Account"}</span>
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Switch to Register Link */}
            <div style={{ marginTop: "24px", textAlign: "center", paddingTop: "20px", borderTop: "1px solid #F3F4F6" }}>
              <p style={{ fontSize: "14px", color: "#6B7280" }}>
                Don't have an account yet?{" "}
                <Link to="/auth/register" style={{ fontWeight: "700", color: "#2563EB", textDecoration: "none" }}>
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
