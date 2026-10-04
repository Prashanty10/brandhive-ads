import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/seller/Sidebar";
import AdvertisementCard from "../../components/common/AdvertisementCard";
import { getSellerAdSpacesApi, deleteAdSpaceApi } from "../../api/adspaceApi";
import { getSellerBookingsApi } from "../../api/bookingApi";
import { useAuth } from "../../auth/AuthContext";
import { Megaphone, CalendarCheck, TrendingUp, PlusCircle, ArrowUpRight, Clock, Store } from "lucide-react";

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
            <div className="responsive-ad-grid">
              {spaces.slice(0, 6).map((space) => (
                <AdvertisementCard
                  key={space._id || space.id}
                  space={space}
                  mode="seller"
                  onClick={() => navigate(`/seller/advertisements/create?edit=${space._id || space.id}`)}
                  onEdit={() => navigate(`/seller/advertisements/create?edit=${space._id || space.id}`)}
                  onDelete={handleDeleteSpace}
                  actionLoading={actionId === (space._id || space.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerDashboardPage;
