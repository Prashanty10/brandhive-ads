import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";
import RoleSelector from "./RoleSelector";
import { useAuth } from "../../auth/AuthContext";
import { Mail, Lock, User, AlertCircle, ArrowRight, ArrowLeft, Megaphone, Store, Sparkles, ShieldCheck } from "lucide-react";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  // Step: 'select_role' (Step 1: Choose Advertiser vs Space Owner) | 'form' (Step 2: Sign In / Register)
  const [step, setStep] = useState("select_role");
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [role, setRole] = useState("buyer"); // 'buyer' (Advertiser) | 'seller' (Space Owner)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setStep("select_role");
      setMode(initialMode);
      setError("");
    }
  }, [isOpen, initialMode]);

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    setStep("form");
    setError("");
  };

  const handleModeSwitch = (newMode) => {
    setError("");
    setMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (mode === "register") {
      if (!username.trim()) {
        setError("Please enter a username.");
        return;
      }
      if (!termsAccepted) {
        setError("Please accept the Terms and Conditions to proceed.");
        return;
      }
    }

    try {
      setLoading(true);
      if (mode === "login") {
        const res = await login(email.trim(), password, role);
        onClose();
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
      } else if (mode === "register") {
        sessionStorage.setItem("pendingOtpEmail", email.trim());
        await register(username.trim(), email.trim(), password, role);
        onClose();
        navigate("/auth/verify-otp", { state: { email: email.trim() } });
      }
    } catch (err) {
      const errMsg = err?.message || "";
      if (errMsg.toLowerCase().includes("email not verified") || errMsg.toLowerCase().includes("verify your email")) {
        sessionStorage.setItem("pendingOtpEmail", email.trim());
        onClose();
        navigate("/auth/verify-otp", { state: { email: email.trim() } });
        return;
      }
      setError(errMsg || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="840px">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", minHeight: "480px" }} className="auth-grid">
        {/* Left Side Visual Banner */}
        <div style={{
          backgroundColor: "#111827",
          color: "#FFFFFF",
          padding: "40px",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundImage: "linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(17, 24, 39, 0.95) 100%), url('https://i.pinimg.com/1200x/73/9a/78/739a789fb56fc0caf72d54b928363534.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} className="desktop-only">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", marginBottom: "24px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22C55E" }} />
              <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" }}>BRANDHIVE PLATFORM</span>
            </div>

            <h2 style={{ fontSize: "28px", fontWeight: "900", lineHeight: "1.2", marginBottom: "16px" }}>
              {step === "select_role"
                ? "Welcome to BrandHive"
                : (role === "seller" ? "List & Monetize Your Spaces" : "Discover High-Impact Advertising")}
            </h2>

            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>
              {step === "select_role"
                ? "Select whether you want to book advertising channels or list your physical and digital ad spaces."
                : (role === "seller"
                  ? "Connect with brands, manage hoardings, bus wraps, LED screens, and track revenue."
                  : "Explore thousands of verified billboards, transit ads, mall banners, and digital platforms across top cities.")}
            </p>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "20px" }}>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
              Trusted by leading advertisers and billboard owners across India.
            </p>
          </div>
        </div>

        {/* Right Side Step Content */}
        <div style={{ padding: "16px 16px 16px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          
          {/* STEP 1: ROLE SELECTION SCREEN */}
          {step === "select_role" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "24px", fontWeight: "900", color: "#111827", marginBottom: "6px" }}>
                  Welcome to BrandHive
                </h3>
                <p style={{ fontSize: "14px", color: "#6B7280" }}>
                  How would you like to get started today?
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                {/* Option 1: Advertiser */}
                <button
                  type="button"
                  onClick={() => handleSelectRole("buyer")}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    padding: "20px",
                    borderRadius: "18px",
                    border: "2px solid #E5E7EB",
                    backgroundColor: "#FFFFFF",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2563EB";
                    e.currentTarget.style.backgroundColor = "#EFF6FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: "#EFF6FF",
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Megaphone size={22} />
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "800", color: "#111827" }}>
                        I am an Advertiser
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#2563EB", backgroundColor: "#DBEAFE", padding: "2px 8px", borderRadius: "9999px" }}>
                        Buyer
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px", lineHeight: "1.4" }}>
                      Discover and book physical billboards, transit wraps, shopping mall displays & digital ads.
                    </p>
                  </div>
                </button>

                {/* Option 2: Space Owner */}
                <button
                  type="button"
                  onClick={() => handleSelectRole("seller")}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    padding: "20px",
                    borderRadius: "18px",
                    border: "2px solid #E5E7EB",
                    backgroundColor: "#FFFFFF",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2563EB";
                    e.currentTarget.style.backgroundColor = "#EFF6FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: "#F5F3FF",
                    color: "#7C3AED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Store size={22} />
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "800", color: "#111827" }}>
                        I am a Space Owner
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#7C3AED", backgroundColor: "#EDE9FE", padding: "2px 8px", borderRadius: "9999px" }}>
                        Media Owner
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px", lineHeight: "1.4" }}>
                      List your billboards, transit ads, mall screens, or digital displays to earn revenue.
                    </p>
                  </div>
                </button>
              </div>

              <div style={{ textAlign: "center", fontSize: "13px", color: "#6B7280" }}>
                <span>Already registered? </span>
                <button
                  onClick={() => handleSelectRole("buyer")}
                  style={{ border: "none", backgroundColor: "transparent", color: "#2563EB", fontWeight: "700", cursor: "pointer" }}
                >
                  Sign In directly
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOGIN / REGISTER FORM */}
          {step === "form" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <button
                  type="button"
                  onClick={() => setStep("select_role")}
                  style={{ border: "none", backgroundColor: "transparent", color: "#6B7280", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <ArrowLeft size={14} />
                  <span>Choose role</span>
                </button>

                <span style={{ fontSize: "12px", fontWeight: "700", color: role === "seller" ? "#7C3AED" : "#2563EB", backgroundColor: role === "seller" ? "#F5F3FF" : "#EFF6FF", padding: "3px 10px", borderRadius: "9999px" }}>
                  {role === "seller" ? "Space Owner Mode" : "Advertiser Mode"}
                </span>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", marginBottom: "4px" }}>
                  {mode === "login" ? `Sign In as ${role === "seller" ? "Space Owner" : "Advertiser"}` : `Create ${role === "seller" ? "Space Owner" : "Advertiser"} Account`}
                </h3>
                <p style={{ fontSize: "13px", color: "#6B7280" }}>
                  {mode === "login" ? "Enter your email & password to access your dashboard" : "Fill in your details below to create your account"}
                </p>
              </div>

              {error && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FEE2E2",
                  color: "#EF4444",
                  fontSize: "13px",
                  marginBottom: "14px"
                }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <RoleSelector selectedRole={role} onChange={setRole} />

                {mode === "register" && (
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                      Username
                    </label>
                    <div style={{ position: "relative" }}>
                      <User size={16} color="#9CA3AF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        type="text"
                        required
                        placeholder={role === "seller" ? "e.g. billboard_owner" : "e.g. brand_manager"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: "38px" }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} color="#9CA3AF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: "38px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} color="#9CA3AF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: "38px" }}
                    />
                  </div>
                </div>

                {mode === "register" && (
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#6B7280", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      style={{ accentColor: "#111827", width: "16px", height: "16px" }}
                    />
                    I agree to the Terms of Service & Privacy Policy
                  </label>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%", marginTop: "6px" }}
                >
                  {loading ? (
                    <div style={{ width: "20px", height: "20px", border: "2px solid #FFF", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  ) : (
                    <>
                      <span>{mode === "login" ? `Sign In as ${role === "seller" ? "Space Owner" : "Advertiser"}` : `Create ${role === "seller" ? "Space Owner" : "Advertiser"} Account`}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: "16px", textAlign: "center", fontSize: "13px", color: "#6B7280" }}>
                {mode === "login" ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      onClick={() => handleModeSwitch("register")}
                      style={{ border: "none", backgroundColor: "transparent", color: "#2563EB", fontWeight: "700", cursor: "pointer" }}
                    >
                      Register now
                    </button>
                  </p>
                ) : (
                  <p>
                    Already registered?{" "}
                    <button
                      onClick={() => handleModeSwitch("login")}
                      style={{ border: "none", backgroundColor: "transparent", color: "#2563EB", fontWeight: "700", cursor: "pointer" }}
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
