import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: "#FFFFFF",
      borderTop: "1px solid #E5E7EB",
      padding: "64px 24px 32px 24px",
      marginTop: "auto"
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
          marginBottom: "48px"
        }}>
          {/* Brand info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#111827",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "16px"
              }}>
                BH
              </div>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "#111827" }}>
                BrandHive
              </span>
            </div>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.6", maxWidth: "280px" }}>
              Connect Brands With Spaces That Get Seen. Discover high-impact advertising spaces online and offline.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Advertising Spaces
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#6B7280" }}>
              <li><Link to="/buyer/discover?category=Billboard" style={{ color: "inherit" }}>Billboards & Hoardings</Link></li>
              <li><Link to="/buyer/discover?category=Mall" style={{ color: "inherit" }}>Mall Advertising</Link></li>
              <li><Link to="/buyer/discover?category=Bus" style={{ color: "inherit" }}>Transit & Bus Ads</Link></li>
              <li><Link to="/buyer/discover?category=Digital" style={{ color: "inherit" }}>Digital Screens & LED</Link></li>
              <li><Link to="/buyer/discover?category=Social Media" style={{ color: "inherit" }}>Online & Social Media</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Platform
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#6B7280" }}>
              <li><Link to="/buyer/home" style={{ color: "inherit" }}>Advertiser Experience</Link></li>
              <li><Link to="/seller/dashboard" style={{ color: "inherit" }}>Space Owner Dashboard</Link></li>
              <li><Link to="/buyer/discover" style={{ color: "inherit" }}>Discover Spaces</Link></li>
              <li><Link to="/buyer/bookings" style={{ color: "inherit" }}>Campaign Management</Link></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              BrandHive Support
            </h4>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.6", marginBottom: "8px" }}>
              Need help listing your advertising space or launching a campaign?
            </p>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#2563EB" }}>
              support@brandhive.com
            </p>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid #F3F4F6",
          paddingTop: "24px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          fontSize: "13px",
          color: "#9CA3AF"
        }}>
          <p>© {new Date().getFullYear()} BrandHive Platform. All rights reserved.</p>
          <div style={{ display: "flex", gap: "24px" }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
