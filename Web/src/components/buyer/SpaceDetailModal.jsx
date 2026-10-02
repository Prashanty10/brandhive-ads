import React, { useState } from "react";
import Modal from "../common/Modal";
import { createBookingApi } from "../../api/bookingApi";
import { MapPin, Calendar, Phone, Mail, User, Info, CheckCircle, Tag, Clock, ArrowRight } from "lucide-react";

const SpaceDetailModal = ({ isOpen, onClose, space, onBookingCreated }) => {
  if (!space) return null;

  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const title = space.title || "Advertisement Space";
  const category = space.category || "Media Space";
  const city = space.location?.city || space.city || "Location specified";
  const state = space.location?.state || space.state || "";
  const address = space.location?.address || space.address || "";
  const latitude = space.location?.latitude || space.latitude;
  const longitude = space.location?.longitude || space.longitude;
  const price = Number(space.price || 0);

  const seller = space.sellerID || space.seller || {};
  const sellerName = seller.firstName
    ? `${seller.firstName} ${seller.lastName || ""}`.trim()
    : seller.name || "Verified Seller";
  const sellerPhone = seller.mobileNumber || seller.mobile || "Available upon request";

  const images = Array.isArray(space.images) && space.images.length > 0 ? space.images : [];
  const thumbnail = images[0] || "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=800&auto=format&fit=crop&q=80";

  // Calculate campaign duration & price
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
        adspaceID: space._id,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="880px">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="space-detail-grid">
        {/* Left Column: Image Gallery & Specifications */}
        <div>
          <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", height: "240px", marginBottom: "16px" }}>
            <img src={thumbnail} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: "rgba(17, 24, 39, 0.85)",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 12px",
              borderRadius: "9999px"
            }}>
              {category}
            </div>
          </div>

          <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
            {title}
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4B5563", fontSize: "14px", marginBottom: "16px" }}>
            <MapPin size={16} color="#EF4444" />
            <span>{[city, state].filter(Boolean).join(", ")}</span>
          </div>

          {/* Location details card */}
          <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
            <h4 style={{ fontSize: "12px", fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", marginBottom: "8px" }}>
              Exact Address & Coordinates
            </h4>
            <p style={{ fontSize: "13px", color: "#111827", marginBottom: "6px" }}>
              {address || `${city}, ${state}`}
            </p>
            {latitude && longitude && (
              <p style={{ fontSize: "12px", color: "#2563EB", fontWeight: "600" }}>
                GPS: {latitude}, {longitude}
              </p>
            )}
          </div>

          {/* Seller details card */}
          <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "16px", padding: "16px" }}>
            <h4 style={{ fontSize: "12px", fontWeight: "700", color: "#1D4ED8", textTransform: "uppercase", marginBottom: "8px" }}>
              Space Owner Information
            </h4>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#2563EB", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                <User size={18} />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>{sellerName}</p>
                <p style={{ fontSize: "13px", color: "#2563EB", fontWeight: "600" }}>📞 {sellerPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form & Pricing Breakdown */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "36px 12px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
                Booking Request Sent! 🎉
              </h3>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.6", marginBottom: "24px" }}>
                Your advertising campaign request has been submitted to {sellerName}. You can track status updates from "My Bookings".
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
                <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", marginBottom: "16px" }}>
                  Book Campaign Space
                </h4>

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
                    Campaign Notes / Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about your brand or banner design..."
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
                <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6B7280", marginBottom: "8px" }}>
                    <span>Daily Rate</span>
                    <span>₹{price.toLocaleString("en-IN")} / day</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6B7280", marginBottom: "8px" }}>
                    <span>Campaign Duration</span>
                    <span>{diffDays} days</span>
                  </div>

                  <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>Total Budget</span>
                    <span style={{ fontSize: "22px", fontWeight: "800", color: "#2563EB" }}>
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-blue btn-lg"
                  style={{ width: "100%" }}
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
