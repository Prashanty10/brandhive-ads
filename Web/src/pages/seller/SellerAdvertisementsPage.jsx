import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/seller/Sidebar";
import Pagination from "../../components/common/Pagination";
import AdvertisementCard from "../../components/common/AdvertisementCard";
import { getSellerAdSpacesApi, toggleAdSpaceStatusApi, deleteAdSpaceApi } from "../../api/adspaceApi";
import { PlusCircle, Megaphone } from "lucide-react";

const SellerAdvertisementsPage = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [actionId, setActionId] = useState(null);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const res = await getSellerAdSpacesApi({ page, limit: 12 });
      if (res?.success) {
        setSpaces(res.data || []);
        setPagination(res.pagination || null);
      } else if (Array.isArray(res)) {
        setSpaces(res);
        setPagination(null);
      }
    } catch (err) {
      console.error("Error fetching seller ad spaces:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [page]);

  const handleToggleStatus = async (spaceId, currentStatus) => {
    const newStatus = currentStatus === "Inactive" || currentStatus === "inactive" ? "Active" : "Inactive";
    try {
      setActionId(spaceId);
      const res = await toggleAdSpaceStatusApi(spaceId, newStatus);
      if (res?.success) {
        setSpaces((prev) =>
          prev.map((s) => ((s._id || s.id) === spaceId ? { ...s, status: newStatus } : s))
        );
      }
    } catch (err) {
      alert(err?.message || "Failed to update ad space status.");
    } finally {
      setActionId(null);
    }
  };

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

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F7F7F5" }} className="seller-layout">
      <Sidebar />

      <main className="seller-main-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Inventory Management
            </span>
            <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#111827", letterSpacing: "-0.5px" }}>
              My Advertising Spaces
            </h1>
          </div>

          <Link to="/seller/advertisements/create" className="btn btn-blue btn-lg">
            <PlusCircle size={18} />
            List New Ad Space
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "#6B7280" }}>Loading ad spaces...</p>
        ) : spaces.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E5E7EB" }}>
            <Megaphone size={48} color="#9CA3AF" style={{ marginBottom: "16px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "6px" }}>
              No advertising spaces listed
            </h3>
            <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "24px" }}>
              Create your first billboard, mall, or digital space listing.
            </p>
            <Link to="/seller/advertisements/create" className="btn btn-primary btn-lg">
              Create Ad Space
            </Link>
          </div>
        ) : (
          <div className="responsive-ad-grid buyer-ad-grid">
            {spaces.map((space) => (
              <AdvertisementCard
                key={space._id || space.id}
                space={space}
                mode="seller"
                onClick={() => navigate(`/seller/advertisements/create?edit=${space._id || space.id}`)}
                onEdit={(sp) => navigate(`/seller/advertisements/create?edit=${sp._id || sp.id}`)}
                onToggleStatus={(sp) => handleToggleStatus(sp._id || sp.id, sp.status || "Active")}
                onDelete={handleDeleteSpace}
              />
            ))}
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
      </main>
    </div>
  );
};

export default SellerAdvertisementsPage;
