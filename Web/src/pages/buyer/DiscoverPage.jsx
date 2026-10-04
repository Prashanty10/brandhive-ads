import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import SpaceCard from "../../components/buyer/SpaceCard";
import SpaceDetailModal from "../../components/buyer/SpaceDetailModal";
import Pagination from "../../components/common/Pagination";
import { SkeletonGrid } from "../../components/common/Skeleton";
import { searchAdSpacesApi } from "../../api/adspaceApi";
import { useAuth } from "../../auth/AuthContext";
import {
  Search,
  Filter,
  RefreshCcw,
  MapPin,
  Compass,
  Building2,
  X
} from "lucide-react";

const OFFLINE_CATEGORIES = [
  { id: "all", label: "All Offline Categories", key: "All" },
  { id: "billboard", label: "Billboards & Hoardings", key: "Billboard" },
  { id: "digital", label: "Digital LED Screens", key: "Digital" },
  { id: "bus", label: "Transit & Bus Wraps", key: "Bus" },
  { id: "metro", label: "Metro & Railway Ads", key: "Metro" },
  { id: "mall", label: "Mall & Retail Displays", key: "Mall" },
  { id: "rickshaw", label: "Auto & Rickshaw Branding", key: "Rickshaw" },
  { id: "airport", label: "Airport Terminal Ads", key: "Airport" }
];

const POPULAR_CITIES = ["All Cities", "Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Ahmedabad"];

const BUDGET_OPTIONS = [
  { id: "all", label: "Any Budget" },
  { id: "under10k", label: "Under ₹10,000" },
  { id: "10k_50k", label: "₹10,000 - ₹50,000" },
  { id: "50k_100k", label: "₹50,000 - ₹1,00,000" },
  { id: "above100k", label: "Above ₹1,00,000" }
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

const matchBudget = (priceVal, budgetId) => {
  if (!budgetId || budgetId === "all") return true;
  const p = Number(priceVal) || 0;
  if (budgetId === "under10k") return p > 0 && p <= 10000;
  if (budgetId === "10k_50k") return p >= 10000 && p <= 50000;
  if (budgetId === "50k_100k") return p >= 50000 && p <= 100000;
  if (budgetId === "above100k") return p >= 100000;
  return true;
};

const DiscoverPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("q") || "";
  const initialSort = searchParams.get("sort") || "recommended";

  // State Filters
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [cityFilter, setCityFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [sortBy, setSortBy] = useState(initialSort);
  const [coords, setCoords] = useState(null);

  // Data State
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

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
        (err) => console.log("Geolocation error:", err)
      );
    }
  }, [user]);

  // Sync state from URL params
  useEffect(() => {
    const sortParam = searchParams.get("sort") || "recommended";
    const categoryParam = searchParams.get("category") || "All";
    const qParam = searchParams.get("q") || "";

    if (sortParam !== sortBy) setSortBy(sortParam);
    if (categoryParam !== category) setCategory(categoryParam);
    if (qParam !== searchQuery) setSearchQuery(qParam);
  }, [searchParams]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category, cityFilter, budgetFilter, sortBy]);

  // Fetch Offline Spaces API
  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
      };
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (category !== "All" && category !== "all") params.category = category;
      if (cityFilter.trim() && cityFilter !== "All Cities") {
        params.city = cityFilter.trim();
      }
      if (sortBy) params.sort = sortBy;
      if (coords?.latitude != null && coords?.longitude != null) {
        params.latitude = coords.latitude;
        params.longitude = coords.longitude;
      }

      const searchRes = await searchAdSpacesApi(params);

      if (searchRes?.success) {
        setSpaces(searchRes.data || []);
        setPagination(searchRes.pagination || null);
      } else {
        setSpaces([]);
        setPagination(null);
      }
    } catch (err) {
      console.error("Discover fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [page, searchQuery, category, cityFilter, budgetFilter, sortBy, coords]);

  const handleSpaceClick = (space) => {
    setSelectedSpace(space);
    setSpaceModalOpen(true);
  };

  const handleResetFilters = () => {
    setCategory("All");
    setSearchQuery("");
    setCityFilter("");
    setBudgetFilter("all");
    setSortBy("recommended");
    setSearchParams({});
  };

  // Safe Filtered Offline Spaces
  const filteredOfflineSpaces = (Array.isArray(spaces) ? spaces : [])
    .filter((s) => {
      if (!s) return false;
      if (!matchCategory(s, category)) return false;
      if (!matchBudget(s.price, budgetFilter)) return false;

      if (cityFilter.trim() && cityFilter !== "All Cities") {
        const qCity = cityFilter.toLowerCase();
        const spaceCity = (typeof s.location?.city === "string" ? s.location.city : typeof s.city === "string" ? s.city : "").toLowerCase();
        const spaceState = (typeof s.location?.state === "string" ? s.location.state : typeof s.state === "string" ? s.state : "").toLowerCase();
        if (!spaceCity.includes(qCity) && !spaceState.includes(qCity)) return false;
      }

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
      if (sortBy === "price_asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortBy === "price_desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sortBy === "title_asc") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "distance") return (Number(a.distanceKm) || 9999) - (Number(b.distanceKm) || 9999);
      return 0;
    });

  const totalResults = filteredOfflineSpaces.length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F5", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="responsive-container" style={{ flex: 1 }}>
        {/* Header & Single Main Search Bar */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#111827", letterSpacing: "-0.4px", marginBottom: "4px" }}>
              Discover Offline Advertising Spaces
            </h1>
            <p style={{ fontSize: "13px", color: "#6B7280" }}>
              Explore physical outdoor billboards, digital LED screens, transit wraps, and shopping mall ad displays.
            </p>
          </div>

          {/* SINGLE UNIFIED SEARCH BAR */}
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.04)"
          }}>
            <Search size={19} color="#9CA3AF" />
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
                color: "#111827",
                padding: "6px 0"
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{ border: "none", backgroundColor: "#F3F4F6", borderRadius: "50%", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={14} color="#6B7280" />
              </button>
            )}
          </div>
        </div>

        {/* Filter & Results Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "24px" }} className="discover-grid">
          {/* Left Sidebar Filter */}
          <aside style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            padding: "16px",
            height: "fit-content",
            position: "sticky",
            top: "88px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "800", fontSize: "14px", color: "#111827" }}>
                <Filter size={16} color="#2563EB" />
                <span>Filter Options</span>
              </div>

              <button
                onClick={handleResetFilters}
                style={{ border: "none", backgroundColor: "transparent", color: "#2563EB", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <RefreshCcw size={12} />
                Reset
              </button>
            </div>

            {/* Offline Categories Filter */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px", display: "block" }}>
                Media Categories
              </label>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {OFFLINE_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.key;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: isSelected ? "700" : "500",
                        color: isSelected ? "#2563EB" : "#4B5563",
                        backgroundColor: isSelected ? "#EFF6FF" : "transparent",
                        border: isSelected ? "1px solid #DBEAFE" : "1px solid transparent",
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
            </div>

            {/* City / Location Filter */}
            <div style={{ marginBottom: "20px", paddingTop: "14px", borderTop: "1px solid #F3F4F6" }}>
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
                City / Location
              </label>
              <div style={{ position: "relative", marginBottom: "8px" }}>
                <MapPin size={15} color="#9CA3AF" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Delhi, Pune..."
                  value={cityFilter === "All Cities" ? "" : cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  style={{
                    width: "100%",
                    height: "36px",
                    paddingLeft: "32px",
                    paddingRight: "10px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    fontSize: "12px",
                    backgroundColor: "#F9FAFB",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {POPULAR_CITIES.map((c) => {
                  const isSel = (c === "All Cities" && (!cityFilter || cityFilter === "All Cities")) || cityFilter.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => setCityFilter(c === "All Cities" ? "" : c)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: isSel ? "700" : "500",
                        backgroundColor: isSel ? "#111827" : "#F3F4F6",
                        color: isSel ? "#FFFFFF" : "#4B5563",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Filter */}
            <div style={{ marginBottom: "20px", paddingTop: "14px", borderTop: "1px solid #F3F4F6" }}>
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
                Budget / Price Range
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {BUDGET_OPTIONS.map((b) => {
                  const isSelected = budgetFilter === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setBudgetFilter(b.id)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: isSelected ? "700" : "500",
                        color: isSelected ? "#2563EB" : "#4B5563",
                        backgroundColor: isSelected ? "#EFF6FF" : "transparent",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer"
                      }}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Options */}
            <div style={{ paddingTop: "14px", borderTop: "1px solid #F3F4F6" }}>
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px", display: "block" }}>
                Sort Results By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: "100%",
                  height: "36px",
                  padding: "0 10px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  backgroundColor: "#F9FAFB",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#111827",
                  outline: "none"
                }}
              >
                <option value="recommended">Recommended</option>
                <option value="distance">Distance: Nearest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title_asc">Name: A to Z</option>
              </select>
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
              border: "1px solid #E5E7EB",
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <div>
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#111827" }}>
                  {totalResults} Space{totalResults === 1 ? "" : "s"} Found
                </span>
                {category !== "All" && (
                  <span style={{ fontSize: "12px", color: "#6B7280", marginLeft: "6px" }}>
                    in <strong>{category}</strong>
                  </span>
                )}
                {cityFilter && cityFilter !== "All Cities" && (
                  <span style={{ fontSize: "12px", color: "#2563EB", marginLeft: "6px" }}>
                    • Location: <strong>{cityFilter}</strong>
                  </span>
                )}
              </div>

              {(category !== "All" || searchQuery || (cityFilter && cityFilter !== "All Cities") || budgetFilter !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "12px", padding: "4px 10px" }}
                >
                  Clear Active Filters
                </button>
              )}
            </div>

            {loading ? (
              <SkeletonGrid count={6} />
            ) : totalResults === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 24px", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                <Compass size={40} color="#9CA3AF" style={{ marginBottom: "12px" }} />
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
                  No matching advertisement spaces found
                </h4>
                <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>
                  Try broadening your keyword search, selecting another category, or clearing active filters.
                </p>
                <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="responsive-ad-grid">
                  {filteredOfflineSpaces.map((space) => (
                    <SpaceCard
                      key={space._id || space.id || Math.random()}
                      space={space}
                      mode="buyer"
                      onClick={handleSpaceClick}
                    />
                  ))}
                </div>

                <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
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

export default DiscoverPage;
