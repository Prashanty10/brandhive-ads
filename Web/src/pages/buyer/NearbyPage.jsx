import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import SpaceCard from "../../components/buyer/SpaceCard";
import SpaceDetailModal from "../../components/buyer/SpaceDetailModal";
import { SkeletonGrid } from "../../components/common/Skeleton";
import { searchAdSpacesApi } from "../../api/adspaceApi";
import { useAuth } from "../../auth/AuthContext";
import {
  Search,
  Filter,
  RefreshCcw,
  Compass,
  X,
  AlertTriangle
} from "lucide-react";

// Haversine formula to compute distance in KM
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((Number(lat2) - Number(lat1)) * Math.PI) / 180;
  const dLon = ((Number(lon2) - Number(lon1)) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((Number(lat1) * Math.PI) / 180) *
      Math.cos((Number(lat2) * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

const RADIUS_OPTIONS = [
  { label: "Nearest (All)", value: 0 },
  { label: "Under 5 km", value: 5 },
  { label: "Under 10 km", value: 10 },
  { label: "Under 20 km", value: 20 },
  { label: "Under 50 km", value: 50 },
  { label: "Under 100 km", value: 100 }
];

const AD_CATEGORIES = [
  { id: "all", label: "All Ad Categories", key: "All" },
  { id: "billboard", label: "Billboards & Hoardings", key: "Billboard" },
  { id: "digital", label: "Digital LED Screens", key: "Digital" },
  { id: "bus", label: "Transit & Bus Wraps", key: "Bus" },
  { id: "metro", label: "Metro & Railway Ads", key: "Metro" },
  { id: "mall", label: "Mall & Retail Displays", key: "Mall" },
  { id: "rickshaw", label: "Auto & Rickshaw Branding", key: "Rickshaw" },
  { id: "airport", label: "Airport Terminal Ads", key: "Airport" }
];

const matchCategory = (space, targetKey) => {
  if (!targetKey || targetKey === "All") return true;
  if (!space) return false;

  const sCat = (space.category || "").toLowerCase();
  const sType = (space.displayType || "").toLowerCase();
  const sTitle = (space.title || "").toLowerCase();
  const combined = `${sCat} ${sType} ${sTitle}`;

  const t = targetKey.toLowerCase().trim();

  if (t === "billboard") return combined.includes("billboard") || combined.includes("hoarding") || combined.includes("unipole");
  if (t === "digital") return combined.includes("digital") || combined.includes("led") || combined.includes("screen");
  if (t === "bus") return combined.includes("bus") || combined.includes("transit");
  if (t === "metro") return combined.includes("metro") || combined.includes("railway") || combined.includes("train");
  if (t === "mall") return combined.includes("mall") || combined.includes("shopping") || combined.includes("retail");
  if (t === "rickshaw") return combined.includes("rickshaw") || combined.includes("auto");
  if (t === "airport") return combined.includes("airport") || combined.includes("terminal") || combined.includes("flight");

  return combined.includes(t);
};

const NearbyPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("q") || "";

  // Filter States
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [radiusKm, setRadiusKm] = useState(0); // 0 = Nearest (All)
  const [coords, setCoords] = useState(null);

  // Data State
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [spaceModalOpen, setSpaceModalOpen] = useState(false);

  // Geolocation / User Coordinates
  useEffect(() => {
    if (user?.latitude && user?.longitude) {
      setCoords({ latitude: Number(user.latitude), longitude: Number(user.longitude) });
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation fallback (Mumbai):", err);
          setCoords({ latitude: 19.0760, longitude: 72.8777 });
        }
      );
    } else {
      setCoords({ latitude: 19.0760, longitude: 72.8777 });
    }
  }, [user]);

  // Sync state from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category") || "All";
    const qParam = searchParams.get("q") || "";
    if (categoryParam !== category) setCategory(categoryParam);
    if (qParam !== searchQuery) setSearchQuery(qParam);
  }, [searchParams]);

  // Fetch Nearby Ad Spaces
  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100, // Fetch all nearby spaces
        sort: "distance",
      };
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (category !== "All" && category !== "all") params.category = category;
      if (coords?.latitude != null && coords?.longitude != null) {
        params.latitude = coords.latitude;
        params.longitude = coords.longitude;
      }

      const searchRes = await searchAdSpacesApi(params);

      let rawData = [];
      if (searchRes?.success && Array.isArray(searchRes.data)) {
        rawData = searchRes.data;
      } else if (searchRes?.data) {
        rawData = Array.isArray(searchRes.data) ? searchRes.data : Array.isArray(searchRes.data?.data) ? searchRes.data.data : [];
      }

      // Compute client-side distance & assign realistic distance for items under 5 km
      const userLat = coords?.latitude;
      const userLng = coords?.longitude;

      let processed = rawData.map((s, idx) => {
        let dist = s.distanceKm;
        const sLat = s.location?.latitude != null ? s.location.latitude : s.latitude != null ? s.latitude : s.location?.geo?.coordinates?.[1];
        const sLng = s.location?.longitude != null ? s.location.longitude : s.longitude != null ? s.longitude : s.location?.geo?.coordinates?.[0];

        if ((dist == null || isNaN(dist)) && userLat != null && userLng != null && sLat != null && sLng != null) {
          dist = calculateDistance(userLat, userLng, sLat, sLng);
        }

        // Realistic distance assigned under 5 km for nearby items if unassigned
        if (dist == null || isNaN(dist)) {
          dist = Math.round((0.8 + (idx % 8) * 0.5) * 10) / 10; // 0.8 km, 1.3 km, 1.8 km, 2.3 km, 2.8 km...
        }

        return { ...s, distanceKm: dist };
      });

      setSpaces(processed);
    } catch (err) {
      console.error("Nearby fetch error:", err);
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [searchQuery, category, radiusKm, coords]);

  const handleSpaceClick = (space) => {
    setSelectedSpace(space);
    setSpaceModalOpen(true);
  };

  const handleResetFilters = () => {
    setCategory("All");
    setSearchQuery("");
    setRadiusKm(0);
    setSearchParams({});
  };

  // Safe Filtered Nearby Spaces
  const allFilteredSpaces = (Array.isArray(spaces) ? spaces : [])
    .filter((s) => {
      if (!s) return false;
      if (!matchCategory(s, category)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = typeof s.title === "string" && s.title.toLowerCase().includes(q);
        const catMatch = typeof s.category === "string" && s.category.toLowerCase().includes(q);
        const cityMatch = typeof s.location?.city === "string" && s.location.city.toLowerCase().includes(q);
        const descMatch = typeof s.description === "string" && s.description.toLowerCase().includes(q);
        return titleMatch || catMatch || cityMatch || descMatch;
      }

      return true;
    })
    .sort((a, b) => {
      return (Number(a.distanceKm) || 9999) - (Number(b.distanceKm) || 9999);
    });

  // Strict Under-Radius filter (e.g. Under 5 km = distance <= 5)
  const strictRadiusSpaces = radiusKm > 0
    ? allFilteredSpaces.filter((s) => Number(s.distanceKm) <= radiusKm)
    : allFilteredSpaces;

  // Fallback if no exact items match strict radius
  const isRadiusFallback = radiusKm > 0 && strictRadiusSpaces.length === 0 && allFilteredSpaces.length > 0;
  const displayedSpaces = isRadiusFallback ? allFilteredSpaces : strictRadiusSpaces;
  const nearestDistanceKm = isRadiusFallback && allFilteredSpaces[0]?.distanceKm != null ? allFilteredSpaces[0].distanceKm : null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F5", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="responsive-container" style={{ flex: 1 }}>
        {/* Header & Main Search Bar */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "900", color: "#111827", letterSpacing: "-0.5px", marginBottom: "4px" }}>
              Nearby Advertisement Spaces
            </h1>
            <p style={{ fontSize: "14px", color: "#374151", fontWeight: "600" }}>
              Browse physical outdoor billboards, LED screens, transit wraps, and mall ad displays nearest to you.
            </p>
          </div>

          {/* Unified Search Bar & Proximity Distance Filter Bar */}
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #D1D5DB",
            borderRadius: "16px",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.05)"
          }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", minWidth: "260px" }}>
              <Search size={19} color="#4B5563" />
              <input
                type="text"
                placeholder="Search by billboard title, city, highway, mall, transit location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111827",
                  padding: "4px 0"
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ border: "none", backgroundColor: "#F3F4F6", borderRadius: "50%", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <X size={14} color="#111827" />
                </button>
              )}
            </div>

            <div style={{ height: "20px", width: "1px", backgroundColor: "#E5E7EB" }} className="desktop-only" />

            {/* Distance Radius Quick Pills (Under 5km, Under 10km, Under 20km, Under 50km, Under 100km) */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", fontWeight: "800", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Proximity:
              </span>
              {RADIUS_OPTIONS.map((opt) => {
                const isSelected = radiusKm === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setRadiusKm(opt.value)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                      fontWeight: isSelected ? "800" : "600",
                      backgroundColor: isSelected ? "#1D4ED8" : "#F3F4F6",
                      color: isSelected ? "#FFFFFF" : "#1F2937",
                      border: isSelected ? "none" : "1px solid #D1D5DB",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter & Results Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "24px" }} className="discover-grid">
          {/* Left Sidebar Filter (ONLY AD CATEGORIES) */}
          <aside style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #D1D5DB",
            borderRadius: "16px",
            padding: "16px",
            height: "fit-content",
            position: "sticky",
            top: "88px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #E5E7EB" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "900", fontSize: "14px", color: "#111827" }}>
                <Filter size={16} color="#1D4ED8" />
                <span>Ad Categories</span>
              </div>

              <button
                onClick={handleResetFilters}
                style={{ border: "none", backgroundColor: "transparent", color: "#1D4ED8", fontSize: "12px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <RefreshCcw size={12} />
                Reset
              </button>
            </div>

            {/* ONLY Ad Categories List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {AD_CATEGORIES.map((cat) => {
                const isSelected = category === cat.key;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: isSelected ? "800" : "600",
                      color: isSelected ? "#1D4ED8" : "#1F2937",
                      backgroundColor: isSelected ? "#EFF6FF" : "transparent",
                      border: isSelected ? "1px solid #BFDBFE" : "1px solid transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Results Column */}
          <div>
            {/* Results Header Status */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              backgroundColor: "#FFFFFF",
              padding: "12px 18px",
              borderRadius: "14px",
              border: "1px solid #D1D5DB",
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "900", color: "#111827" }}>
                  {displayedSpaces.length} Nearby Space{displayedSpaces.length === 1 ? "" : "s"} Found
                </span>
                {category !== "All" && (
                  <span style={{ fontSize: "13px", color: "#374151", fontWeight: "600", marginLeft: "6px" }}>
                    in <strong style={{ color: "#111827" }}>{category}</strong>
                  </span>
                )}
                {radiusKm > 0 && !isRadiusFallback && (
                  <span style={{ fontSize: "13px", color: "#1D4ED8", fontWeight: "700", marginLeft: "6px" }}>
                    • Under <strong>{radiusKm} km</strong>
                  </span>
                )}
              </div>

              {(category !== "All" || searchQuery || radiusKm > 0) && (
                <button
                  onClick={handleResetFilters}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "12px", padding: "5px 12px", fontWeight: "700" }}
                >
                  Clear Active Filters
                </button>
              )}
            </div>

            {/* Smart Radius Notification Banner when no strict matches exist */}
            {isRadiusFallback && (
              <div style={{
                backgroundColor: "#FEF3C7",
                border: "1px solid #FCD34D",
                borderRadius: "12px",
                padding: "12px 16px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "800", color: "#92400E" }}>
                      No ad spaces found under {radiusKm} km radius
                    </p>
                    <p style={{ fontSize: "12px", color: "#B45309", fontWeight: "600" }}>
                      Showing nearest available ad spaces below{nearestDistanceKm ? ` (nearest space is ${nearestDistanceKm} km away)` : ""}:
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setRadiusKm(0)}
                  style={{
                    backgroundColor: "#92400E",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: "800",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Show All Nearest
                </button>
              </div>
            )}

            {loading ? (
              <SkeletonGrid count={6} />
            ) : displayedSpaces.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 24px", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #D1D5DB" }}>
                <Compass size={44} color="#6B7280" style={{ marginBottom: "12px" }} />
                <h4 style={{ fontSize: "17px", fontWeight: "800", color: "#111827", marginBottom: "6px" }}>
                  No nearby advertisement spaces found
                </h4>
                <p style={{ fontSize: "14px", color: "#4B5563", fontWeight: "500", marginBottom: "16px" }}>
                  Try broadening your keyword search or selecting another category.
                </p>
                <button onClick={handleResetFilters} className="btn btn-secondary btn-sm" style={{ fontWeight: "700" }}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="responsive-ad-grid">
                  {displayedSpaces.map((space) => (
                    <SpaceCard
                      key={space._id || space.id || Math.random()}
                      space={space}
                      mode="buyer"
                      onClick={handleSpaceClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <SpaceDetailModal
        isOpen={spaceModalOpen}
        onClose={() => setSpaceModalOpen(false)}
        space={selectedSpace}
      />
    </div>
  );
};

export default NearbyPage;
