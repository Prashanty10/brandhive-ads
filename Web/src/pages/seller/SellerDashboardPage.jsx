import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/seller/Sidebar";
import { getSellerAdSpacesApi, deleteAdSpaceApi } from "../../api/adspaceApi";
import { getSellerBookingsApi } from "../../api/bookingApi";
import { useAuth } from "../../auth/AuthContext";
import { Megaphone, CalendarCheck, TrendingUp, PlusCircle, ArrowUpRight, Clock, Store, Edit3, Trash2, MapPin, Eye, Maximize2 } from "lucide-react";

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [spacesRes, bookingsRes] = await Promise.allSettled([
          getSellerAdSpacesApi(),
          getSellerBookingsApi()
        ]);

        if (spacesRes.status === "fulfilled" && Array.isArray(spacesRes.value?.data)) {
          setSpaces(spacesRes.value.data);
        }
        if (bookingsRes.status === "fulfilled" && Array.isArray(bookingsRes.value?.data)) {
          setBookings(bookingsRes.value.data);
        }
      } catch (err) {
        console.error("Seller dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteSpace = async (spaceId) => {
    if (!window.confirm("Are you sure you want to delete this ad space listing?")) {
      return;
    }
    try {
      setActionId(spaceId);
      await deleteAdSpaceApi(spaceId);
      setSpaces((prev) => prev.filter((s) => (s._id || s.id) !== spaceId));
    } catch (err) {
      alert(err?.message || "Failed to delete ad space.");
    } finally {
      setActionId(null);
    }
  };

  const totalSpaces = spaces.length;
  const activeSpaces = spaces.filter((s) => s.status !== "Inactive").length;
  const pendingRequests = bookings.filter((b) => (b.status || "Pending").toLowerCase() === "pending").length;
  const activeBookings = bookings.filter((b) => (b.status || "").toLowerCase() === "active").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F7F7F5" }} className="seller-layout">
      <Sidebar />

      <main className="seller-main-content">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Space Owner Portal
            </span>
            <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#111827", letterSpacing: "-0.5px" }}>
              Seller Dashboard
            </h1>
          </div>

          <Link to="/seller/advertisements/create" className="btn btn-blue btn-lg">
            <PlusCircle size={18} />
            List New Ad Space
          </Link>
        </div>

        {/* Overview Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#6B7280" }}>Total Listed Spaces</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Megaphone size={18} />
              </div>
            </div>
            <span style={{ fontSize: "28px", fontWeight: "900", color: "#111827" }}>{totalSpaces}</span>
            <span style={{ fontSize: "12px", color: "#059669", display: "block", marginTop: "4px" }}>
              {activeSpaces} active spaces listed
            </span>
          </div>

          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#6B7280" }}>Pending Requests</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#FFFBEB", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={18} />
              </div>
            </div>
            <span style={{ fontSize: "28px", fontWeight: "900", color: "#D97706" }}>{pendingRequests}</span>
            <span style={{ fontSize: "12px", color: "#6B7280", display: "block", marginTop: "4px" }}>
              Requires seller approval
            </span>
          </div>

          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#6B7280" }}>Active Campaigns</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CalendarCheck size={18} />
              </div>
            </div>
            <span style={{ fontSize: "28px", fontWeight: "900", color: "#059669" }}>{activeBookings}</span>
            <span style={{ fontSize: "12px", color: "#059669", display: "block", marginTop: "4px" }}>
              Currently running campaigns
            </span>
          </div>
        </div>

        {/* Listed Ad Spaces Section */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#111827" }}>
              My Listed Advertising Spaces
            </h3>
            <Link to="/seller/advertisements" style={{ fontSize: "13px", fontWeight: "700", color: "#2563EB" }}>
              Manage All Spaces →
            </Link>
          </div>

          {loading ? (
            <p style={{ color: "#6B7280", fontSize: "14px" }}>Loading inventory...</p>
          ) : spaces.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E5E7EB" }}>
              <Megaphone size={40} color="#9CA3AF" style={{ marginBottom: "12px" }} />
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
                No ad spaces listed yet
              </h4>
              <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "20px" }}>
                Start earning by listing your billboard, mall, or digital screen inventory.
              </p>
              <Link to="/seller/advertisements/create" className="btn btn-primary btn-sm">
                List First Ad Space
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "24px" }}>
              {spaces.slice(0, 6).map((space) => {
                const status = space.status || "Active";
                const isInactive = status === "Inactive";
                const img = Array.isArray(space.images) && space.images[0] ? space.images[0] : "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=80";

                const dims = space.dimensions || space.specifications?.dimensions || "Standard Size";
                const impressions = space.estimatedDailyImpressions || "10,000+";
                const city = space.location?.city || space.city || "Location specified";
                const state = space.location?.state || space.state || "";
                const fullLoc = `${city}${state ? `, ${state}` : ""}`;
                const priceFormatted = Number(space.price || space.monthlyPrice || 0).toLocaleString("en-IN");
                const unit = (space.priceUnit || "per month").replace("per ", "");

                return (
                  <div
                    key={space._id}
                    className="card"
                    style={{
                      padding: "0",
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.04)"
                    }}
                  >
                    {/* Header Image Thumbnail Banner */}
                    <div style={{ position: "relative", height: "160px", overflow: "hidden", backgroundColor: "#111827" }}>
                      <img
                        src={img}
                        alt={space.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isInactive ? 0.65 : 1 }}
                      />

                      {/* Category Tag */}
                      <div style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        backgroundColor: "rgba(17, 24, 39, 0.85)",
                        backdropFilter: "blur(8px)",
                        color: "#FFFFFF",
                        fontSize: "10px",
                        fontWeight: "800",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        {space.category || "Billboard"}
                      </div>

                      {/* Status Badge */}
                      <div style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        backgroundColor: isInactive ? "#6B7280" : "#059669",
                        color: "#FFFFFF",
                        fontSize: "10px",
                        fontWeight: "800",
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.25)"
                      }}>
                        {status.toUpperCase()}
                      </div>

                      {/* Daily Impressions Overlay Pill */}
                      {impressions && (
                        <div style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "12px",
                          backgroundColor: "rgba(0,0,0,0.75)",
                          backdropFilter: "blur(6px)",
                          color: "#FFFFFF",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "3px 9px",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <Eye size={12} color="#60A5FA" />
                          <span>{impressions} /day</span>
                        </div>
                      )}
                    </div>

                    {/* Content & Specs Area */}
                    <div style={{ padding: "18px 20px" }}>
                      {/* Space Title */}
                      <h4 style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        color: "#111827",
                        marginBottom: "6px",
                        lineHeight: "1.3",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }} title={space.title}>
                        {space.title}
                      </h4>

                      {/* Location Row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6B7280", fontSize: "13px", marginBottom: "14px" }}>
                        <MapPin size={15} color="#EF4444" style={{ flexShrink: 0 }} />
                        <span style={{ fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {fullLoc}
                        </span>
                      </div>

                      {/* Specifications Pills */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                        {dims && (
                          <span style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#374151",
                            backgroundColor: "#F3F4F6",
                            padding: "3px 9px",
                            borderRadius: "6px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}>
                            <Maximize2 size={11} color="#6B7280" />
                            {dims}
                          </span>
                        )}
                        {space.displayType && (
                          <span style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#2563EB",
                            backgroundColor: "#EFF6FF",
                            padding: "3px 9px",
                            borderRadius: "6px"
                          }}>
                            {space.displayType}
                          </span>
                        )}
                        {space.bookingType && (
                          <span style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#059669",
                            backgroundColor: "#ECFDF5",
                            padding: "3px 9px",
                            borderRadius: "6px"
                          }}>
                            {space.bookingType}
                          </span>
                        )}
                      </div>

                      {/* Price Tag Row */}
                      <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
                        <div>
                          <span style={{ fontSize: "20px", fontWeight: "900", color: "#2563EB", letterSpacing: "-0.5px" }}>
                            ₹{priceFormatted}
                          </span>
                          <span style={{ fontSize: "12px", color: "#6B7280", marginLeft: "4px", fontWeight: "600" }}>
                            / {unit}
                          </span>
                        </div>
                      </div>

                      {/* Card Action Controls: Edit & Delete */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Link
                          to={`/seller/advertisements/create?edit=${space._id}`}
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#1D4ED8",
                            backgroundColor: "#EFF6FF",
                            border: "1px solid #BFDBFE",
                            padding: "9px 14px",
                            borderRadius: "10px",
                            textDecoration: "none",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <Edit3 size={14} color="#1D4ED8" />
                          <span>Edit Space</span>
                        </Link>

                        <button
                          onClick={() => handleDeleteSpace(space._id)}
                          disabled={actionId === space._id}
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#DC2626",
                            backgroundColor: "#FEF2F2",
                            border: "1px solid #FECACA",
                            padding: "9px 14px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <Trash2 size={14} color="#DC2626" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerDashboardPage;
