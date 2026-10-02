import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Megaphone,
  Store,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowLeft,
  Check
} from "lucide-react";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("buyer"); // 'buyer' | 'seller'
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions to proceed.");
      return;
    }

    try {
      setLoading(true);
      sessionStorage.setItem("pendingOtpEmail", email.trim());
      await register(username.trim(), email.trim(), password, role);
      navigate("/auth/verify-otp", { state: { email: email.trim() } });
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
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
                <span>CREATE FREE ACCOUNT</span>
              </div>

              <h2 style={{ fontSize: "28px", fontWeight: "800", lineHeight: "1.2", marginBottom: "16px", letterSpacing: "-0.5px" }}>
                Join India's Fastest Growing Ad Marketplace.
              </h2>
              <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.6", marginBottom: "32px" }}>
                Whether you want to launch brand campaigns or monetize your advertising spaces, get started in less than 2 minutes.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Building2 size={18} color="#60A5FA" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "700" }}>For Advertisers</h4>
                    <p style={{ fontSize: "12px", color: "#9CA3AF" }}>Find & book physical hoardings, LEDs & transit wraps</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Store size={18} color="#34D399" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "700" }}>For Space Owners</h4>
                    <p style={{ fontSize: "12px", color: "#9CA3AF" }}>List your billboards & digital screens to earn revenue</p>
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
                Create Account
              </h3>
              <p style={{ fontSize: "14px", color: "#6B7280" }}>
                Choose your role and fill in your details to create your BrandHive account.
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px", display: "block" }}>
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <User size={18} color="#9CA3AF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="text"
                    required
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: "100%",
                      height: "44px",
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
                      height: "44px",
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
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      height: "44px",
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

              {/* Terms Checkbox */}
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#4B5563", cursor: "pointer", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: "#2563EB" }}
                />
                <span>I agree to BrandHive's Terms & Privacy Policy</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "6px",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
                }}
              >
                <span>{loading ? "Creating Account..." : "Create Account & Verify OTP"}</span>
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Switch to Login Link */}
            <div style={{ marginTop: "20px", textAlign: "center", paddingTop: "16px", borderTop: "1px solid #F3F4F6" }}>
              <p style={{ fontSize: "14px", color: "#6B7280" }}>
                Already have an account?{" "}
                <Link to="/auth/login" style={{ fontWeight: "700", color: "#2563EB", textDecoration: "none" }}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
