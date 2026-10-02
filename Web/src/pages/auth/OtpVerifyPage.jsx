import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpApi } from "../../api/authApi";
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { KeyRound, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

const OtpVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser, user, isVerified, isAuthenticated, isProfileCompleted, activeRole } = useAuth();

  const initialEmail = location.state?.email || user?.email || sessionStorage.getItem("pendingOtpEmail") || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef([]);

  React.useEffect(() => {
    if (isAuthenticated && isVerified) {
      if (!isProfileCompleted) {
        navigate("/auth/profile-setup", { replace: true });
      } else if (activeRole === "seller") {
        navigate("/seller/dashboard", { replace: true });
      } else {
        navigate("/buyer/home", { replace: true });
      }
    }
  }, [isAuthenticated, isVerified, isProfileCompleted, activeRole, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
      inputRefs.current[Math.min(5, newOtp.length - 1)].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    try {
      setLoading(true);
      await verifyOtpApi(email.trim(), fullOtp);
      await refreshUser();
      sessionStorage.removeItem("pendingOtpEmail");
      setSuccess(true);
      setTimeout(() => {
        navigate("/auth/profile-setup");
      }, 1000);
    } catch (err) {
      setError(err?.message || "Invalid OTP code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F5", display: "flex", flexDirection: "column" }}>
      <header style={{ height: "72px", backgroundColor: "#FFF", borderBottom: "1px solid #E5E7EB", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "20px", fontWeight: "800", color: "#111827", cursor: "pointer" }} onClick={() => navigate("/")}>
          BrandHive
        </span>
        <button
          onClick={() => navigate("/")}
          style={{ border: "none", backgroundColor: "transparent", fontSize: "14px", color: "#6B7280", fontWeight: "600", cursor: "pointer" }}
        >
          Cancel & Back
        </button>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "36px",
          boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.08)",
          border: "1px solid #E5E7EB",
          textAlign: "center"
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            backgroundColor: "#EFF6FF",
            color: "#2563EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto"
          }}>
            <KeyRound size={28} />
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
            Verify Your Email
          </h2>

          <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "20px", lineHeight: "1.5" }}>
            Enter the 6-digit OTP code sent to your registered email address.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="input-field"
                style={{ fontSize: "14px" }}
              />
            </div>

            {error && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                borderRadius: "12px",
                backgroundColor: "#FEF2F2",
                color: "#EF4444",
                fontSize: "13px",
                marginBottom: "20px",
                textAlign: "left"
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                borderRadius: "12px",
                backgroundColor: "#ECFDF5",
                color: "#059669",
                fontSize: "13px",
                marginBottom: "20px"
              }}>
                <CheckCircle2 size={16} />
                <span>OTP verified successfully! Redirecting to profile setup...</span>
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  style={{
                    width: "48px",
                    height: "56px",
                    borderRadius: "12px",
                    border: digit ? "2px solid #2563EB" : "1px solid #E5E7EB",
                    backgroundColor: digit ? "#EFF6FF" : "#F9FAFB",
                    fontSize: "22px",
                    fontWeight: "800",
                    textAlign: "center",
                    color: "#111827",
                    outline: "none"
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default OtpVerifyPage;
