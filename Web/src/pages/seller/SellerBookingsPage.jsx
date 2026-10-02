import React, { useState, useEffect } from "react";
import Sidebar from "../../components/seller/Sidebar";
import Pagination from "../../components/common/Pagination";
import { getSellerBookingsApi, updateBookingStatusApi } from "../../api/bookingApi";
import { CalendarCheck, CheckCircle2, XCircle, User, Phone, Mail, Clock } from "lucide-react";

const TABS = ["Pending", "Active", "Completed", "Cancelled"];

const SellerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
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
        status: activeTab,
      };
      const res = await getSellerBookingsApi(params);
      if (res?.success) {
        setBookings(res.data || []);
        setPagination(res.pagination || null);
      } else if (Array.isArray(res)) {
        setBookings(res);
        setPagination(null);
      }
    } catch (err) {
      console.error("Error fetching seller bookings:", err);
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

  const handleUpdateStatus = async (bookingId, newStatus, buyerName) => {
    const isApprove = newStatus === "Active";
    const confirmMsg = isApprove
      ? `Accept campaign booking request from ${buyerName}?`
      : `Decline campaign booking request from ${buyerName}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setActionId(bookingId);
      const res = await updateBookingStatusApi(bookingId, newStatus);
      if (res?.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      alert(err?.message || "Failed to update booking status.");
    } finally {
      setActionId(null);
    }
  };

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
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F7F7F5" }} className="seller-layout">
      <Sidebar />

      <main className="seller-main-content">
        <div style={{ marginBottom: "28px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Campaign Management
          </span>
          <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#111827", letterSpacing: "-0.5px" }}>
            Buyer Campaign Requests
          </h1>
        </div>

        {/* Status Filter Tabs */}
        <div style={{
          display: "flex",
          gap: "8px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          padding: "6px",
          marginBottom: "32px",
          maxWidth: "100%",
          overflowX: "auto"
        }} className="hide-scrollbar">
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
                  cursor: "pointer"
                }}
              >
                {tab} {isSelected && pagination?.total != null ? `(${pagination.total})` : ""}
              </button>
            );
          })}
        </div>

        {/* Bookings Grid */}
        {loading ? (
          <p style={{ color: "#6B7280" }}>Loading campaign requests...</p>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E5E7EB" }}>
            <CalendarCheck size={48} color="#9CA3AF" style={{ marginBottom: "16px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "6px" }}>
              No {activeTab.toLowerCase()} campaign requests
            </h3>
            <p style={{ fontSize: "14px", color: "#6B7280" }}>
              You don't have any campaign requests under "{activeTab}" at the moment.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {bookings.map((b) => {
              const space = b.adspaceID || {};
              const buyer = b.buyerID || {};
              const buyerName = buyer.firstName ? `${buyer.firstName} ${buyer.lastName || ""}`.trim() : buyer.name || "Buyer Customer";
              const priceFormatted = `₹${Number(b.totalPrice || space.price || 0).toLocaleString("en-IN")}`;

              return (
                <div key={b._id} className="card seller-booking-card-grid">
                  {/* Buyer & Campaign Details */}
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#2563EB", textTransform: "uppercase" }}>
                      Buyer Customer Request
                    </span>
                    <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", margin: "4px 0" }}>
                      {buyerName}
                    </h4>

                    <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>
                      {buyer.email && <span>📧 {buyer.email}</span>}
                      {buyer.mobileNumber && <span>📞 {buyer.mobileNumber}</span>}
                    </div>

                    {b.notes && (
                      <p style={{ fontSize: "13px", color: "#4B5563", backgroundColor: "#F9FAFB", padding: "8px 12px", borderRadius: "8px", marginTop: "10px", fontStyle: "italic" }}>
                        "{b.notes}"
                      </p>
                    )}
                  </div>

                  {/* Ad Space & Dates */}
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase" }}>
                      Target Ad Space
                    </span>
                    <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: "2px 0 6px 0" }}>
                      {space.title || "Advertising Space"}
                    </h5>
                    <p style={{ fontSize: "13px", color: "#6B7280" }}>
                      📅 {formatDate(b.startDate)} – {formatDate(b.endDate)}
                    </p>
                  </div>

                  {/* Budget & Actions */}
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase", fontWeight: "700", display: "block" }}>
                      Total Budget
                    </span>
                    <span style={{ fontSize: "22px", fontWeight: "800", color: "#2563EB", display: "block", marginBottom: "12px" }}>
                      {priceFormatted}
                    </span>

                    {activeTab === "Pending" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleUpdateStatus(b._id, "Cancelled", buyerName)}
                          disabled={actionId === b._id}
                          className="btn btn-secondary btn-sm"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b._id, "Active", buyerName)}
                          disabled={actionId === b._id}
                          className="btn btn-blue btn-sm"
                        >
                          Accept Request
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
      </main>
    </div>
  );
};

export default SellerBookingsPage;
