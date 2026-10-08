import React, { useState } from "react";
import {
  MapPin,
  Eye,
  ArrowRight,
  Edit2,
  PauseCircle,
  PlayCircle,
  Trash2,
  CheckCircle2,
  Zap,
  TrendingUp
} from "lucide-react";
import { getCategorySpecPills } from "../../config/categoryFields";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=800&auto=format&fit=crop&q=80";

const AdvertisementCard = ({
  space,
  mode = "buyer", // 'buyer' | 'seller'
  onClick,
  onEdit,
  onToggleStatus,
  onDelete,
  actionLoading = false,
}) => {
  const [imgSrc, setImgSrc] = useState(() => {
    if (Array.isArray(space?.images) && space.images.length > 0 && space.images[0]) {
      return space.images[0];
    }
    if (typeof space?.image === "string" && space.image) {
      return space.image;
    }
    return DEFAULT_IMAGE;
  });

  const [isHovered, setIsHovered] = useState(false);

  if (!space) return null;

  const title = space.title || "Advertisement Space";
  const category = (space.category || space.displayType || "Billboard").toUpperCase();
  const city = space.location?.city || space.city || "Location specified";
  const state = space.location?.state || space.state || "";
  const addressText = `${city}${state ? `, ${state}` : ""}`;
  const distanceText = space.distanceKm != null ? `${space.distanceKm} km away` : null;

  const priceNum = Number(space.price || space.monthlyPrice || 0);
  const priceFormatted = priceNum > 0 ? `₹${priceNum.toLocaleString("en-IN")}` : "Contact for Quote";
  const priceUnit = (space.priceUnit || "per month").replace(/^per\s+/i, "");

  const status = (space.status || "active").toLowerCase();
  const isInactive = status === "inactive" || status === "paused";
  const isAvailable = space.availability?.isAvailable !== false && !isInactive;

  const isVerified = Boolean(space.isVerified || space.sellerVerification || space.seller?.isVerified);
  const bookingType = space.bookingType || space.specifications?.bookingType || "Instant Booking";
  const impressions = space.estimatedDailyImpressions || space.impressions || null;
  const specPills = getCategorySpecPills(space);

  const formattedImpressions = impressions
    ? typeof impressions === "number"
      ? impressions >= 1000
        ? `${(impressions / 1000).toFixed(0)}K`
        : impressions.toString()
      : impressions
    : null;

  const handleCardClick = (e) => {
    if (onClick) {
      onClick(space, e);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "330px",
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 16px 25px -8px rgba(0, 0, 0, 0.09), 0 6px 12px -4px rgba(0, 0, 0, 0.04)"
          : "0 3px 10px rgba(0, 0, 0, 0.03)"
      }}
    >
      {/* ── Image Header Container ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "180px",
          backgroundColor: "#0F172A",
          overflow: "hidden",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px"
        }}
      >
        {/* Ambient Blurred Background Image */}
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          onError={() => setImgSrc(DEFAULT_IMAGE)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(14px) brightness(0.65)",
            transform: "scale(1.15)",
            opacity: isInactive ? 0.45 : 0.75,
            pointerEvents: "none"
          }}
        />

        {/* Foreground Primary Image */}
        <img
          src={imgSrc}
          alt={title}
          onError={() => setImgSrc(DEFAULT_IMAGE)}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isInactive ? 0.75 : 1,
            transition: "transform 0.4s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)"
          }}
        />

        {/* Top-Left: Category Tag & Verified Seller Pill */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(17, 24, 39, 0.85)",
              backdropFilter: "blur(8px)",
              color: "#FFFFFF",
              fontSize: "10px",
              fontWeight: "800",
              padding: "4px 10px",
              borderRadius: "9999px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
            }}
          >
            {category}
          </div>

          {isVerified && (
            <div
              style={{
                backgroundColor: "#ECFDF5",
                color: "#047857",
                border: "1px solid #A7F3D0",
                fontSize: "10px",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
              }}
            >
              <CheckCircle2 size={11} color="#047857" />
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Top-Right: Status / Availability Badge */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 3,
            backgroundColor:
              mode === "seller"
                ? isInactive
                  ? "#6B7280"
                  : "#059669"
                : isAvailable
                ? "#059669"
                : "#D97706",
            color: "#FFFFFF",
            fontSize: "10px",
            fontWeight: "800",
            padding: "4px 10px",
            borderRadius: "9999px",
            letterSpacing: "0.5px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF"
            }}
          />
          <span>
            {mode === "seller"
              ? isInactive
                ? "INACTIVE"
                : "AVAILABLE NOW"
              : isAvailable
              ? "AVAILABLE NOW"
              : "BOOKED"}
          </span>
        </div>

        {/* Bottom-Left Overlay: Booking Type Pill */}
        {bookingType && (
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "10px",
              zIndex: 3,
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(6px)",
              color: "#FFFFFF",
              fontSize: "10px",
              fontWeight: "700",
              padding: "3px 9px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <Zap size={10} color="#F59E0B" />
            <span>{bookingType}</span>
          </div>
        )}
      </div>

      {/* ── Content Body Container (Compact Snug Spacing) ── */}
      <div
        style={{
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between"
        }}
      >
        <div>
          {/* Card Title */}
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "800",
              color: "#111827",
              lineHeight: "1.25",
              marginBottom: "3px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              maxHeight: "38px"
            }}
            title={title}
          >
            {title}
          </h3>

          {/* Location & Distance Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#4B5563",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "6px"
            }}
          >
            <MapPin size={13} color="#EF4444" style={{ flexShrink: 0 }} />
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {addressText}
            </span>
            {distanceText && (
              <>
                <span style={{ color: "#9CA3AF" }}>•</span>
                <span style={{ color: "#2563EB", fontWeight: "700", flexShrink: 0 }}>
                  {distanceText}
                </span>
              </>
            )}
          </div>

          {/* Metadata Row: Category-tailored specification pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "6px",
              marginBottom: "6px"
            }}
          >
            {specPills.map((pill, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#374151",
                  backgroundColor: "#F1F5F9",
                  padding: "2px 7px",
                  borderRadius: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px"
                }}
              >
                <span>{pill.icon}</span>
                <span>{pill.text}</span>
              </span>
            ))}

            {formattedImpressions && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#047857",
                  backgroundColor: "#ECFDF5",
                  padding: "2px 7px",
                  borderRadius: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px"
                }}
              >
                <TrendingUp size={11} color="#047857" />
                {formattedImpressions} reach
              </span>
            )}
          </div>
        </div>

        {/* ── Footer / Action Bar Pinned Compactly ── */}
        <div
          style={{
            marginTop: "6px",
            paddingTop: "8px",
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px"
          }}
        >
          {/* Price Column */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
              <span style={{ fontSize: "16px", fontWeight: "900", color: "#1D4ED8" }}>
                {priceFormatted}
              </span>
              {priceNum > 0 && (
                <span style={{ fontSize: "11px", color: "#64748B", fontWeight: "600" }}>
                  / {priceUnit}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: isAvailable ? "#10B981" : "#EF4444"
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: isAvailable ? "#047857" : "#EF4444"
                }}
              >
                {isAvailable ? "Available Now" : "Unavailable"}
              </span>
            </div>
          </div>

          {/* Action Buttons Column */}
          {mode === "buyer" ? (
            <button
              type="button"
              onClick={handleCardClick}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "7px 12px",
                borderRadius: "10px",
                backgroundColor: isHovered ? "#2563EB" : "#EFF6FF",
                color: isHovered ? "#FFFFFF" : "#2563EB",
                fontSize: "12px",
                fontWeight: "700",
                border: "1px solid #BFDBFE",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <span>View Space</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <div
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {onEdit && (
                <button
                  type="button"
                  title="Edit Ad Space"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(space);
                  }}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "10px",
                    border: "1px solid #BFDBFE",
                    backgroundColor: "#EFF6FF",
                    color: "#2563EB",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
              )}

              {onToggleStatus && (
                <button
                  type="button"
                  title={isInactive ? "Activate Listing" : "Pause Listing"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(space);
                  }}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${isInactive ? "#A7F3D0" : "#FDE68A"}`,
                    backgroundColor: isInactive ? "#ECFDF5" : "#FFFBEB",
                    color: isInactive ? "#059669" : "#D97706",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.2s ease"
                  }}
                >
                  {isInactive ? <PlayCircle size={12} /> : <PauseCircle size={12} />}
                  <span>{isInactive ? "Activate" : "Pause"}</span>
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  title="Delete Ad Space"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(space._id || space.id);
                  }}
                  style={{
                    padding: "7px 10px",
                    borderRadius: "10px",
                    border: "1px solid #FCA5A5",
                    backgroundColor: "#FEF2F2",
                    color: "#DC2626",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvertisementCard;
