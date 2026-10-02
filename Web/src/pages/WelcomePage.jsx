import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import AuthModal from "../components/auth/AuthModal";
import { useAuth } from "../auth/AuthContext";
import { ArrowRight, Sparkles, Building2, Monitor, ShieldCheck } from "lucide-react";

const WelcomePage = () => {
  const { isAuthenticated, isVerified, isProfileCompleted, activeRole, loading } = useAuth();
  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (!isVerified) {
        navigate("/auth/verify-otp", { replace: true });
      } else if (!isProfileCompleted) {
        navigate("/auth/profile-setup", { replace: true });
      } else if (activeRole === "seller") {
        navigate("/seller/dashboard", { replace: true });
      } else {
        navigate("/buyer/home", { replace: true });
      }
    }
  }, [loading, isAuthenticated, isVerified, isProfileCompleted, activeRole, navigate]);

  if (loading || isAuthenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7F7F5",
        color: "#111827"
      }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{
            width: "36px",
            height: "36px",
            border: "3px solid #E5E7EB",
            borderTopColor: "#111827",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 14px auto"
          }} />
          <p style={{ color: "#6B7280", fontSize: "14px", fontWeight: "500" }}>Redirecting...</p>
        </div>
      </div>
    );
  }

  const openAuth = (mode = "login") => {
    if (isAuthenticated) {
      if (activeRole === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/buyer/home");
      }
      return;
    }
    if (mode === "register") {
      navigate("/auth/register");
    } else {
      navigate("/auth/login");
    }
  };

  const adCards = [
    {
      title: "Highway Billboard",
      cat: "Billboard",
      city: "Mumbai, MH",
      img: "https://i.pinimg.com/736x/63/df/66/63df66c11c4610dd68a18fb0165cc89e.jpg",
      pos: { top: "10px", left: "1%" },
      animY: [-10, 10, -10],
      delay: 0.2
    },
    {
      title: "Luxury Mall Atrium",
      cat: "Mall",
      city: "Bengaluru, KA",
      img: "https://i.pinimg.com/1200x/c5/06/b6/c506b616bcad2883ea609cba2739da73.jpg",
      pos: { top: "10px", right: "1%" },
      animY: [-12, 12, -12],
      delay: 0.4
    },
    {
      title: "Metro Bus Branding",
      cat: "Transit Bus",
      city: "Delhi, NCR",
      img: "https://i.pinimg.com/1200x/3e/aa/4e/3eaa4efebb7ddb26bdd0c91b6e4a54b1.jpg",
      pos: { bottom: "10px", left: "1%" },
      animY: [10, -10, 10],
      delay: 0.6
    },
    {
      title: "Digital LED Screen",
      cat: "Digital Screen",
      city: "Hyderabad, TS",
      img: "https://i.pinimg.com/736x/86/0d/7e/860d7e94a2edd43cee5fc29d8c5c7078.jpg",
      pos: { bottom: "10px", right: "1%" },
      animY: [12, -12, 12],
      delay: 0.8
    }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F5", display: "flex", flexDirection: "column" }}>
      <Navbar onOpenAuthModal={openAuth} />

      {/* Hero Welcome Section */}
      <section style={{
        position: "relative",
        padding: "40px 24px 60px 24px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* Outer Max-Width Container */}
        <div style={{
          position: "relative",
          maxWidth: "1500px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "560px"
        }}>
          {/* Floating Animated Cards Flanking Hero */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} className="desktop-flank-cards">
            {adCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: [0.9, 1, 0.9],
                  scale: 1,
                  y: card.animY
                }}
                transition={{
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: card.delay },
                  scale: { duration: 0.7, delay: card.delay }
                }}
                style={{
                  position: "absolute",
                  ...card.pos,
                  width: "clamp(310px, 18vw, 290px)",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "14px",
                  boxShadow: "0 16px 32px -10px rgba(0,0,0,0.1)",
                  border: "1px solid #E5E7EB",
                  zIndex: 1
                }}
              >
                <div style={{ width: "100%", height: "155px", borderRadius: "12px", overflow: "hidden", marginBottom: "10px" }}>
                  <img src={card.img} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.cat}</span>
                <p style={{ fontSize: "15px", fontWeight: "800", color: "#111827", lineHeight: "1.2", marginTop: "2px" }}>{card.title}</p>
                <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "3px" }}>📍 {card.city}</p>
              </motion.div>
            ))}
          </div>

          {/* Central Hero Content */}
          <div style={{ maxWidth: "560px", textAlign: "center", position: "relative", zIndex: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "7px 16px",
                borderRadius: "9999px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
                fontSize: "13px",
                fontWeight: "600",
                color: "#111827",
                marginBottom: "24px"
              }}>
                <Sparkles size={15} color="#2563EB" />
                <span>India's Premier Advertising Space Marketplace</span>
              </div>

              <h1 style={{
                fontSize: "clamp(30px, 4vw, 48px)",
                fontWeight: "900",
                color: "#111827",
                letterSpacing: "-1px",
                lineHeight: "1.12",
                marginBottom: "20px"
              }}>
                Connect Brands With Spaces That Get Seen.
              </h1>

              <p style={{
                fontSize: "15px",
                color: "#6B7280",
                lineHeight: "1.55",
                maxWidth: "510px",
                margin: "0 auto 28px auto"
              }}>
                Discover high-impact billboard, transit, mall, digital screen, and online promotional spaces around you. Connect directly with space owners.
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
                <button
                  onClick={() => openAuth("register")}
                  className="btn btn-primary btn-md"
                  style={{ padding: "12px 28px", fontSize: "15px", borderRadius: "10px" }}
                >
                  <span>Get Started Now</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  onClick={() => openAuth("login")}
                  className="btn btn-secondary btn-md"
                  style={{ padding: "12px 24px", fontSize: "15px", borderRadius: "10px" }}
                >
                  Sign In to Account
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile / Tablet Showcase Grid (< 1024px) */}
        <div style={{ width: "100%", marginTop: "32px" }} className="mobile-showcase-grid">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
            maxWidth: "580px",
            margin: "0 auto"
          }}>
            {adCards.map((card, idx) => (
              <div key={idx} className="card" style={{ padding: "12px" }}>
                <div style={{ width: "100%", height: "120px", borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }}>
                  <img src={card.img} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ fontSize: "10px", fontWeight: "700", color: "#2563EB", textTransform: "uppercase" }}>{card.cat}</span>
                <p style={{ fontSize: "13px", fontWeight: "800", color: "#111827", marginTop: "2px" }}>{card.title}</p>
                <p style={{ fontSize: "11px", color: "#6B7280" }}>📍 {card.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E7EB", padding: "60px 24px" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 48px auto" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "10px" }}>
              Everything You Need to Scale Visibility
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280" }}>
              Whether you are an advertiser launching a campaign or a billboard owner earning revenue.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "28px" }}>
            <div className="card" style={{ padding: "22px", borderRadius: "18px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <Building2 size={22} />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
                Physical & Transit Ads
              </h3>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.55" }}>
                Explore high-footfall hoardings, metro station branding, bus wraps, and mall displays across top cities.
              </p>
            </div>

            <div className="card" style={{ padding: "22px", borderRadius: "18px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "#F5F3FF", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <Monitor size={22} />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
                Digital Screen Networks
              </h3>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.55" }}>
                Book digital LED billboards and indoor smart displays with verified impressions and schedule automation.
              </p>
            </div>

            <div className="card" style={{ padding: "22px", borderRadius: "18px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
                Direct Space Booking
              </h3>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.55" }}>
                No middleman markup. Connect directly with space owners, request custom campaign dates, and confirm online.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default WelcomePage;
