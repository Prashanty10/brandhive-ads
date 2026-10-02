import React from "react";
import { Monitor, Building2, Bus, Car, Globe, Share2, Sparkles, Train, Plane } from "lucide-react";

const getCategoryIcon = (name) => {
  const n = (name || "").toLowerCase();
  if (n.includes("billboard") || n.includes("hoarding")) return <Building2 size={24} color="#2563EB" />;
  if (n.includes("digital") || n.includes("led")) return <Monitor size={24} color="#7C3AED" />;
  if (n.includes("bus") || n.includes("transit")) return <Bus size={24} color="#059669" />;
  if (n.includes("metro") || n.includes("railway")) return <Train size={24} color="#D97706" />;
  if (n.includes("mall") || n.includes("retail")) return <Sparkles size={24} color="#DB2777" />;
  if (n.includes("rickshaw") || n.includes("auto")) return <Car size={24} color="#EA580C" />;
  if (n.includes("airport")) return <Plane size={24} color="#0891B2" />;
  if (n.includes("social") || n.includes("online")) return <Share2 size={24} color="#2563EB" />;
  return <Globe size={24} color="#4B5563" />;
};

const CategoryCard = ({ category, count, onClick, isSelected, description }) => {
  return (
    <button
      onClick={() => onClick && onClick(category)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "20px",
        borderRadius: "20px",
        border: isSelected ? "2px solid #2563EB" : "1px solid #E5E7EB",
        backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isSelected ? "0 10px 24px -4px rgba(37, 99, 235, 0.18)" : "0 2px 8px rgba(0,0,0,0.03)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        backgroundColor: isSelected ? "#FFFFFF" : "#F9FAFB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "14px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
      }}>
        {getCategoryIcon(category)}
      </div>

      <span style={{ fontSize: "15px", fontWeight: "800", color: "#111827", marginBottom: "4px", display: "block" }}>
        {category}
      </span>

      {description && (
        <span style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {description}
        </span>
      )}

      <span style={{
        fontSize: "12px",
        fontWeight: "700",
        color: count > 0 ? "#2563EB" : "#9CA3AF",
        backgroundColor: count > 0 ? (isSelected ? "#DBEAFE" : "#F0F7FF") : "#F3F4F6",
        padding: "4px 10px",
        borderRadius: "9999px"
      }}>
        {count !== undefined ? `${count} available spaces` : "Explore spaces"}
      </span>
    </button>
  );
};

export default CategoryCard;
