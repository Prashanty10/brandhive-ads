import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import SkeletonGrid from "../../components/common/Skeleton";
import Pagination from "../../components/common/Pagination";
import { getBuyerBookingsApi, cancelBookingApi } from "../../api/bookingApi";
import { Calendar, Clock, Tag, XCircle, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

const TABS = ["All", "Pending", "Active", "Completed", "Cancelled"];

const STATUS_BADGE = {
  Pending: "badge-pending",
  Active: "badge-active",
  Completed: "badge-completed",
  Cancelled: "badge-cancelled"
};

const BuyerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [actionId, setActionId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };
      if (activeTab !== "All") params.status = activeTab;

      const res = await getBuyerBookingsApi(params);
      if (res?.success) {
        setBookings(res.data || []);
        setPagination(res.pagination || null);
      } else if (Array.isArray(res)) {
        setBookings(res);
        setPagination(null);
      }
    } catch (err) {
      console.error("Error fetching buyer bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, activeTab]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this campaign booking request?")) {
      return;
    }
    try {
      setActionId(bookingId);
      const res = await cancelBookingApi(bookingId);
      if (res?.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: "Cancelled" } : b))
        );
      }
    } catch (err) {
      alert(err?.message || "Failed to cancel booking request.");
    } finally {
      setActionId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "All") return true;
    return (b.status || "Pending").toLowerCase() === activeTab.toLowerCase();
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F5", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ maxWidth: "1280px", width: "100%", margin: "0 auto", padding: "40px 24px", flex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#111827", letterSpacing: "-0.5px", marginBottom: "6px" }}>
            My Campaign Bookings
          </h1>
          <p style={{ fontSize: "15px", color: "#6B7280" }}>
            Track, manage and review your requested advertising space campaigns.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: "flex",
          gap: "8px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          padding: "6px",
          marginBottom: "32px",
          overflowX: "auto"
        }}>
          {TABS.map((tab) => {
            const isSelected = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected ? "#111827" : "#6B7280",
                  backgroundColor: isSelected ? "#F3F4F6" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {tab} {isSelected && pagination?.total != null ? `(${pagination.total})` : ""}
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        {loading ? (
          <SkeletonGrid count={4} />
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E5E7EB" }}>
            <Calendar size={48} color="#9CA3AF" style={{ marginBottom: "16px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "6px" }}>
              No campaign bookings found
            </h3>
            <p style={{ fontSize: "14px", color: "#6B7280" }}>
              You don't have any {activeTab.toLowerCase() !== "all" ? activeTab.toLowerCase() : ""} campaign bookings yet.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {bookings.map((b) => {
              const space = b.adspaceID || {};
              const statusKey = b.status || "Pending";
              const badgeClass = STATUS_BADGE[statusKey] || "badge-pending";
              const image = Array.isArray(space.images) && space.images.length > 0 ? space.images[0] : "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=80";
              const priceFormatted = `₹${Number(b.totalPrice || space.price || 0).toLocaleString("en-IN")}`;

              return (
                <div key={b._id} className="card booking-card-grid">
                  {/* Space Image */}
                  <div style={{ position: "relative", height: "130px", borderRadius: "12px", overflow: "hidden", backgroundColor: "#0F172A" }}>
                    <img
                      src={image}
                      alt=""
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "blur(14px) brightness(0.65)",
                        transform: "scale(1.15)",
                        opacity: 0.75,
                        pointerEvents: "none"
                      }}
                    />
                    <img
                      src={image}
                      alt={space.title}
                      style={{
                        position: "relative",
                        zIndex: 1,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "4px"
                      }}
                    />
                  </div>

                  {/* Booking Info */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <span className={`badge ${badgeClass}`}>{statusKey}</span>
                      <span style={{ fontSize: "12px", color: "#9CA3AF", textTransform: "uppercase", fontWeight: "700" }}>
                        {space.category || "Media Space"}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", marginBottom: "6px" }}>
                      {space.title || "Campaign Space"}
                    </h4>

                    <div style={{ display: "flex", gap: "24px", fontSize: "13px", color: "#6B7280", flexWrap: "wrap" }}>
                      <div>
                        <span style={{ fontWeight: "600", color: "#374151" }}>Duration: </span>
                        <span>{formatDate(b.startDate)} – {formatDate(b.endDate)}</span>
                      </div>

                      {space.location?.city && (
                        <div>
                          <span style={{ fontWeight: "600", color: "#374151" }}>City: </span>
                          <span>{space.location.city}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase", fontWeight: "700", display: "block", marginBottom: "4px" }}>
                      Total Campaign Budget
                    </span>
                    <span style={{ fontSize: "22px", fontWeight: "800", color: "#2563EB", display: "block", marginBottom: "12px" }}>
                      {priceFormatted}
                    </span>

                    {statusKey === "Pending" && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        disabled={actionId === b._id}
                        className="btn btn-secondary btn-sm"
                        style={{ color: "#EF4444", borderColor: "#FCA5A5" }}
                      >
                        {actionId === b._id ? "Cancelling..." : "Cancel Request"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
      </main>

      <Footer />
    </div>
  );
};

export default BuyerBookingsPage;
