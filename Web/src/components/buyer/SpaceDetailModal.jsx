import React, { useState } from "react";
import Modal from "../common/Modal";
import { createBookingApi } from "../../api/bookingApi";
import { getCategorySpecPills } from "../../config/categoryFields";
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  User,
  Info,
  CheckCircle,
  Tag,
  Clock,
  ArrowRight,
  Maximize2,
  Sun,
  Eye,
  TrendingUp,
  Zap,
  CheckCircle2,
  ExternalLink,
  MessageSquare
} from "lucide-react";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=800&auto=format&fit=crop&q=80";

const SpaceDetailModal = ({ isOpen, onClose, space, onBookingCreated }) => {
  if (!space) return null;

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const title = space.title || "Advertisement Space";
  const category = (space.category || space.displayType || "Billboard").toUpperCase();
  const city = space.location?.city || space.city || "Location specified";
  const state = space.location?.state || space.state || "";
  const address = space.location?.address || space.address || "";
  const landmark = space.location?.landmark || space.landmark || "";
  const pincode = space.location?.pincode || space.pincode || "";
  const fullLocation = [address, city, state, pincode].filter(Boolean).join(", ");
  const latitude = space.location?.latitude || space.latitude;
  const longitude = space.location?.longitude || space.longitude;
  const price = Number(space.price || space.monthlyPrice || 0);
  const priceUnit = (space.priceUnit || "per month").replace(/^per\s+/i, "");
  const description = space.description || "";

  const specs = space.specifications || {};
  const visibility = space.visibility || specs.visibility || "24 Hours";
  const impressions = space.estimatedDailyImpressions || space.impressions || null;
  const bookingType = space.bookingType || specs.bookingType || "Instant Booking";
  const minDuration = space.minimumBookingDuration || space.minDuration || "1 Day";
  const specPills = getCategorySpecPills(space);

  const seller = space.sellerID || space.seller || {};
  const sellerName = seller.firstName
    ? `${seller.firstName} ${seller.lastName || ""}`.trim()
    : seller.name || "Verified Seller";
  const sellerPhone = seller.mobileNumber || seller.mobile || seller.phone || space.sellerMobile || "Available upon request";
  const sellerEmail = seller.email || "";
  const isVerified = Boolean(space.isVerified || space.sellerVerification || seller.isVerified);
  const isAvailable = space.availability?.isAvailable !== false && space.status !== "Inactive" && space.status !== "inactive";

  const images = Array.isArray(space.images) && space.images.length > 0 ? space.images : [DEFAULT_IMAGE];
  const activeImage = images[activeImgIdx] || DEFAULT_IMAGE;

  // Calculate campaign duration & total price
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end - start);
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalPrice = price * diffDays;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await createBookingApi({
        adspaceID: space._id || space.id,
        startDate,
        endDate,
        totalPrice,
        notes: notes.trim(),
      });

      setSuccess(true);
      if (onBookingCreated) {
        onBookingCreated(res.data);
      }
    } catch (err) {
      setError(err?.message || "Failed to submit booking request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCallSeller = () => {
    if (sellerPhone && sellerPhone !== "Available upon request") {
      const clean = sellerPhone.replace(/[^0-9+]/g, "");
      window.open(`tel:${clean}`, "_self");
    } else {
      alert("Seller phone number will be shared upon booking confirmation.");
    }
  };

  const handleWhatsappSeller = () => {
    if (sellerPhone && sellerPhone !== "Available upon request") {
      const clean = sellerPhone.replace(/[^0-9]/g, "");
      const num = clean.length === 10 ? `91${clean}` : clean;
      const text = encodeURIComponent(`Hi ${sellerName}, I am interested in your ad space "${title}" on BrandHive.`);
      window.open(`https://wa.me/${num}?text=${text}`, "_blank");
    } else {
      alert("Seller contact details will be shared upon booking confirmation.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="960px">
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "28px" }} className="space-detail-grid">
        {/* Left Column: Image Gallery, Title, Key Metrics, Specifications & Seller Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Main Hero Image */}
          <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", height: "260px", backgroundColor: "#0F172A" }}>
            <img
              src={activeImage}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(16px) brightness(0.65)",
                transform: "scale(1.15)",
                opacity: 0.75,
                pointerEvents: "none"
              }}
            />
            <img
              src={activeImage}
              alt={title}
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "6px"
              }}
            />

            {/* Category Pill */}
            <div style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              zIndex: 3,
              backgroundColor: "rgba(17, 24, 39, 0.85)",
              backdropFilter: "blur(8px)",
              color: "#FFFFFF",
              fontSize: "10px",
              fontWeight: "800",
              padding: "4px 10px",
              borderRadius: "9999px",
              letterSpacing: "0.5px",
              textTransform: "uppercase"
            }}>
              {category}
            </div>

            {/* Availability Badge */}
            <div style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 3,
              backgroundColor: isAvailable ? "#059669" : "#D97706",
              color: "#FFFFFF",
              fontSize: "10px",
              fontWeight: "800",
              padding: "4px 10px",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FFFFFF" }} />
              <span>{isAvailable ? "AVAILABLE NOW" : "BOOKED"}</span>
            </div>
          </div>

          {/* Multiple Image Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  style={{
                    width: "60px",
                    height: "50px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: activeImgIdx === idx ? "2px solid #2563EB" : "1px solid #E5E7EB",
                    opacity: activeImgIdx === idx ? 1 : 0.6,
                    padding: 0,
                    cursor: "pointer",
                    backgroundColor: "#0F172A",
                    flexShrink: 0
                  }}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          {/* Main Title & Location Header */}
          <div>
            <h3 style={{ fontSize: "22px", fontWeight: "900", color: "#111827", lineHeight: "1.3", marginBottom: "6px", letterSpacing: "-0.4px" }}>
              {title}
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4B5563", fontSize: "13px", fontWeight: "600", marginBottom: "10px" }}>
              <MapPin size={15} color="#EF4444" style={{ flexShrink: 0 }} />
              <span>{fullLocation || `${city}, ${state}`}</span>
            </div>

            {/* Badges Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {isVerified && (
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#047857", backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", padding: "3px 9px", borderRadius: "6px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={12} color="#047857" />
                  Verified Seller
                </span>
              )}
              {bookingType && (
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#2563EB", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", padding: "3px 9px", borderRadius: "6px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Zap size={11} color="#2563EB" />
                  {bookingType}
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Category Specifications Pills Bar */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", backgroundColor: "#F8FAFC", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "12px" }}>
            {specPills.map((pill, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#FFFFFF", border: "1px solid #CBD5E1", padding: "6px 12px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", color: "#0F172A" }}>
                <span>{pill.icon}</span>
                <span>{pill.text}</span>
              </div>
            ))}
            {impressions && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", padding: "6px 12px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", color: "#047857" }}>
                <TrendingUp size={14} color="#047857" />
                <span>{typeof impressions === "number" ? `${(impressions / 1000).toFixed(0)}K` : impressions} daily reach</span>
              </div>
            )}
          </div>

          {/* About This Space Description */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "16px" }}>
            <h4 style={{ fontSize: "13px", fontWeight: "800", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
              About This Advertising Space
            </h4>
            <p style={{ fontSize: "13px", color: "#4B5563", lineHeight: "1.6", whiteSpace: "pre-line" }}>
              {description || "High-impact commercial advertising space located in a prime visibility area. Ideal for brand campaigns, product launches, and promotional displays."}
            </p>
          </div>

          {/* Dynamic Technical Specifications Table */}
          <div style={{ backgroundColor: "#F9FAFB", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "14px" }}>
            <h4 style={{ fontSize: "12px", fontWeight: "800", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
              Category & Specification Details
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px" }}>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>Category: </span>
                <span style={{ color: "#111827", fontWeight: "700" }}>{category}</span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>Booking Type: </span>
                <span style={{ color: "#111827", fontWeight: "700" }}>{bookingType}</span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>Min Booking: </span>
                <span style={{ color: "#111827", fontWeight: "700" }}>{minDuration}</span>
              </div>

              {/* Render dynamic category specs */}
              {specs.busType && (
                <div>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Bus Type: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{specs.busType}</span>
                </div>
              )}
              {specs.brandingArea && (
                <div>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Branding Placement: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{specs.brandingArea}</span>
                </div>
              )}
              {(specs.routeZone || specs.coverageArea) && (
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Route / Zones: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{specs.routeZone || specs.coverageArea}</span>
                </div>
              )}
              {specs.fleetCount && (
                <div>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Fleet Quantity: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{specs.fleetCount}</span>
                </div>
              )}
              {specs.stationName && (
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Metro Station: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{specs.stationName}</span>
                </div>
              )}
              {specs.mallName && (
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Mall Name: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{specs.mallName}</span>
                </div>
              )}
              {specs.terminalName && (
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Airport Terminal: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{specs.terminalName}</span>
                </div>
              )}
              {specs.socialPlatform && (
                <div>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Platform: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{specs.socialPlatform}</span>
                </div>
              )}
              {specs.followerReach && (
                <div>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Followers / Traffic: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{specs.followerReach}</span>
                </div>
              )}
              {specs.dimensions && (
                <div>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Dimensions: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{specs.dimensions}</span>
                </div>
              )}
              {(specs.lighting || specs.lightingType) && (
                <div>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Lighting: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{specs.lighting || specs.lightingType}</span>
                </div>
              )}

              {landmark && (
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>Landmark: </span>
                  <span style={{ color: "#111827", fontWeight: "700" }}>{landmark}</span>
                </div>
              )}
              {latitude && longitude && (
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "#6B7280", fontWeight: "600" }}>GPS Coordinates: </span>
                  <span style={{ color: "#2563EB", fontWeight: "700" }}>{latitude}, {longitude}</span>
                </div>
              )}
            </div>
          </div>

          {/* Seller & Contact Details Card */}
          <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "14px", padding: "16px" }}>
            <h4 style={{ fontSize: "12px", fontWeight: "800", color: "#1D4ED8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
              Space Owner & Contact Details
            </h4>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#2563EB", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px" }}>
                  {sellerName.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "800", color: "#111827" }}>{sellerName}</p>
                  <p style={{ fontSize: "13px", color: "#1D4ED8", fontWeight: "700" }}>📞 {sellerPhone}</p>
                  {sellerEmail && <p style={{ fontSize: "11px", color: "#6B7280" }}>✉️ {sellerEmail}</p>}
                </div>
              </div>

              {/* Call & WhatsApp buttons */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={handleCallSeller}
                  style={{
                    backgroundColor: "#059669",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: "700",
                    border: "none",
                    borderRadius: "8px",
                    padding: "7px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <Phone size={13} />
                  <span>Call Seller</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsappSeller}
                  style={{
                    backgroundColor: "#25D366",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: "700",
                    border: "none",
                    borderRadius: "8px",
                    padding: "7px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <MessageSquare size={13} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Campaign Booking Form & Price Calculator */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "36px 16px", backgroundColor: "#F0FDF4", borderRadius: "20px", border: "1px solid #BBF7D0" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#DCFCE7", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
                Booking Request Sent! 🎉
              </h3>
              <p style={{ fontSize: "14px", color: "#4B5563", lineHeight: "1.6", marginBottom: "24px" }}>
                Your campaign request for <strong>{title}</strong> has been submitted to {sellerName}. You can track updates from your "My Bookings" page.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  onClose();
                }}
                className="btn btn-primary btn-lg"
                style={{ width: "100%" }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <div>
                <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", marginBottom: "6px" }}>
                  Reserve Campaign Booking
                </h4>
                <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "18px" }}>
                  Select dates to calculate budget and submit your campaign request to the owner.
                </p>

                {error && (
                  <div style={{ padding: "12px", borderRadius: "12px", backgroundColor: "#FEF2F2", color: "#EF4444", fontSize: "13px", marginBottom: "16px" }}>
                    {error}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                    Campaign Details / Special Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your brand, target audience, banner dimensions or special printing instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      fontSize: "14px",
                      outline: "none",
                      resize: "none"
                    }}
                  />
                </div>
              </div>

              {/* Price Calculation Card */}
              <div>
                <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "18px", marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748B", marginBottom: "8px" }}>
                    <span>Listing Rate</span>
                    <span style={{ fontWeight: "700", color: "#0F172A" }}>₹{price.toLocaleString("en-IN")} / {priceUnit}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748B", marginBottom: "8px" }}>
                    <span>Duration Calculated</span>
                    <span style={{ fontWeight: "700", color: "#0F172A" }}>{diffDays} {diffDays === 1 ? "day" : "days"}</span>
                  </div>

                  <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "12px", marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", display: "block" }}>Total Budget</span>
                      <span style={{ fontSize: "11px", color: "#64748B" }}>Includes basic listing access</span>
                    </div>
                    <span style={{ fontSize: "22px", fontWeight: "900", color: "#1D4ED8" }}>
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-blue btn-lg"
                  style={{ width: "100%", padding: "14px" }}
                >
                  {loading ? "Submitting Request..." : "Request Campaign Booking"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SpaceDetailModal;
