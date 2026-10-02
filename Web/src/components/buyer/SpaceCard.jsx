import React from "react";
import { MapPin, ArrowUpRight } from "lucide-react";

const SpaceCard = ({ space, onClick }) => {
  const title = space.title || "Advertising Space";
  const category = space.category || "Media Space";
  const city = space.location?.city || space.city || "India";
  const price = space.price ? `₹${Number(space.price).toLocaleString("en-IN")}` : "Custom Quote";
  const images = Array.isArray(space.images) && space.images.length > 0 ? space.images : [];
  const thumbnail = images[0] || "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=600&auto=format&fit=crop&q=80";

  return (
    <div
      onClick={() => onClick && onClick(space)}
      className="card card-hover"
      style={{
        padding: "0",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: "16px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #D1D5DB",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}
    >
      {/* Thumbnail Image Header */}
      <div style={{ position: "relative", height: "185px", width: "100%", overflow: "hidden", backgroundColor: "#F3F4F6" }}>
        <img
          src={thumbnail}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
        />
        <div style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "#111827",
          color: "#FFFFFF",
          fontSize: "11px",
          fontWeight: "800",
          padding: "4px 10px",
          borderRadius: "9999px",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          {category}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#111827", marginBottom: "6px", lineHeight: "1.3" }} className="line-clamp-2">
            {title}
          </h4>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#374151", fontSize: "13px", marginBottom: "12px", fontWeight: "600" }}>
            <MapPin size={14} color="#DC2626" style={{ flexShrink: 0 }} />
            <span>
              {city}{space.distanceKm != null ? ` • ${space.distanceKm} km away` : ""}
            </span>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid #E5E7EB",
          paddingTop: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>
            <span style={{ fontSize: "11px", color: "#4B5563", textTransform: "uppercase", fontWeight: "800", display: "block", letterSpacing: "0.4px" }}>
              Rate / Duration
            </span>
            <span style={{ fontSize: "17px", fontWeight: "900", color: "#1D4ED8" }}>
              {price}
            </span>
          </div>

          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#F3F4F6",
            border: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#111827"
          }}>
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;
