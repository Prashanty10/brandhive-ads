import React from "react";
import { Megaphone, Store } from "lucide-react";

const RoleSelector = ({ selectedRole, onChange }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
      {/* Advertiser Card */}
      <button
        type="button"
        onClick={() => onChange("buyer")}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          padding: "16px",
          borderRadius: "18px",
          border: selectedRole === "buyer" ? "2px solid #2563EB" : "1px solid #E5E7EB",
          backgroundColor: selectedRole === "buyer" ? "#EFF6FF" : "#FFFFFF",
          textAlign: "left",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
      >
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "14px",
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "16px", fontWeight: "800", color: "#111827" }}>
              I am an Advertiser
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#2563EB", backgroundColor: "#DBEAFE", padding: "2px 8px", borderRadius: "9999px" }}>
              Buyer
            </span>
          </div>
          <span style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.4", display: "block" }}>
            Discover and book physical billboards, transit wraps, shopping mall displays & digital ads.
          </span>
        </div>
      </button>

      {/* Space Owner Card */}
      <button
        type="button"
        onClick={() => onChange("seller")}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          padding: "16px",
          borderRadius: "18px",
          border: selectedRole === "seller" ? "2px solid #7C3AED" : "1px solid #E5E7EB",
          backgroundColor: selectedRole === "seller" ? "#F3E8FF" : "#FFFFFF",
          textAlign: "left",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
      >
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          backgroundColor: "#F3E8FF",
          color: "#7C3AED",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <Store size={22} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "16px", fontWeight: "800", color: "#111827" }}>
              I am a Space Owner
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#7C3AED", backgroundColor: "#F3E8FF", padding: "2px 8px", borderRadius: "9999px" }}>
              Media Owner
            </span>
          </div>
          <span style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.4", display: "block" }}>
            List your billboards, transit ads, mall screens, or digital displays to earn revenue.
          </span>
        </div>
      </button>
    </div>
  );
};

export default RoleSelector;
