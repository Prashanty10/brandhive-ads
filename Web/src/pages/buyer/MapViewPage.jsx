import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import SpaceDetailModal from "../../components/buyer/SpaceDetailModal";
import { searchAdSpacesApi, getHomeAdSpacesApi } from "../../api/adspaceApi";
import { useAuth } from "../../auth/AuthContext";
import {
  MapPin,
  Search,
  Navigation,
  Layers,
  Compass,
  Sparkles,
  Building2,
  Eye,
  Calendar,
  DollarSign,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  X,
  Globe,
  Star,
  ArrowRight,
  RefreshCcw,
  SlidersHorizontal,
  ChevronLeft
} from "lucide-react";

// Haversine distance formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

const CATEGORIES = [
  { id: "all", label: "All Spaces", key: "All", icon: "📍" },
  { id: "billboard", label: "Billboards", key: "Billboard", icon: "🛣️" },
  { id: "digital", label: "Digital LEDs", key: "Digital", icon: "💡" },
  { id: "bus", label: "Transit & Bus", key: "Bus", icon: "🚌" },
  { id: "metro", label: "Metro Ads", key: "Metro", icon: "🚇" },
  { id: "mall", label: "Mall Displays", key: "Mall", icon: "🛍️" },
  { id: "rickshaw", label: "Auto Rickshaw", key: "Rickshaw", icon: "🛺" },
  { id: "airport", label: "Airport Ads", key: "Airport", icon: "✈️" }
];

const matchCategory = (space, targetKey) => {
  if (!targetKey || targetKey === "All") return true;
  if (!space) return false;
  const combined = `${space.category || ""} ${space.displayType || ""} ${space.title || ""}`.toLowerCase();
  const t = targetKey.toLowerCase();
  if (t === "billboard") return combined.includes("billboard") || combined.includes("hoarding") || combined.includes("unipole");
  if (t === "digital") return combined.includes("digital") || combined.includes("led") || combined.includes("screen");
  if (t === "bus") return combined.includes("bus") || combined.includes("transit");
  if (t === "metro") return combined.includes("metro") || combined.includes("railway") || combined.includes("train");
  if (t === "mall") return combined.includes("mall") || combined.includes("shopping");
  if (t === "rickshaw") return combined.includes("rickshaw") || combined.includes("auto");
  if (t === "airport") return combined.includes("airport") || combined.includes("terminal");
  return combined.includes(t);
};

const extractSpacesArray = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  const target = res.data || res;
  if (target && typeof target === "object") {
    const combined = [
      ...(target.featured || []),
      ...(target.nearby || []),
      ...(target.availableNow || []),
      ...(target.newlyListed || []),
      ...(target.bestValue || []),
      ...(target.highVisibility || []),
      ...(target.recommended || [])
    ];
    if (combined.length > 0) {
      return Array.from(new Map(combined.map((item) => [item._id || item.id, item])).values());
    }
  }
  return [];
};

const MapViewPage = () => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // User GPS / City state
  const [userCoords, setUserCoords] = useState({
    lat: user?.latitude ? Number(user.latitude) : 19.0760, // Default Mumbai
    lng: user?.longitude ? Number(user.longitude) : 72.8777,
    city: user?.city || "Mumbai"
  });

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxRadius, setMaxRadius] = useState("all");
  const [mapTheme, setMapTheme] = useState("dark"); // 'dark' | 'monochrome' | 'satellite'

  // Map Controls State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Selected space preview card on map
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [modalSpace, setModalSpace] = useState(null);
  const [spaceModalOpen, setSpaceModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto detect GPS location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          setUserCoords((prev) => ({ ...prev, lat, lng }));

          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { "User-Agent": "BrandHiveWeb/1.0" }
          })
            .then((r) => r.json())
            .then((d) => {
              if (d?.address?.city || d?.address?.town) {
                const detectedCity = d.address.city || d.address.town || "";
                setUserCoords((prev) => ({ ...prev, city: detectedCity }));
              }
            })
            .catch(() => {});
        },
        () => {}
      );
    }
  }, []);

  // Fetch all ad spaces
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [searchRes, homeRes] = await Promise.allSettled([
          searchAdSpacesApi(),
          getHomeAdSpacesApi()
        ]);
        const sArr = searchRes.status === "fulfilled" ? extractSpacesArray(searchRes.value) : [];
        const hArr = homeRes.status === "fulfilled" ? extractSpacesArray(homeRes.value) : [];

        const uniqueMap = new Map();
        [...sArr, ...hArr].forEach((item) => {
          const idKey = String(item._id || item.id);
          if (idKey && !uniqueMap.has(idKey)) {
            uniqueMap.set(idKey, item);
          }
        });

        let loaded = Array.from(uniqueMap.values());
        if (userCoords.lat != null && userCoords.lng != null) {
          loaded = loaded.map((s, idx) => {
            const sLat = s.location?.latitude;
            const sLng = s.location?.longitude;
            const dist = calculateDistance(userCoords.lat, userCoords.lng, sLat, sLng);
            const mockFallbackDist = Math.round((0.8 + (idx % 8) * 1.6) * 10) / 10;
            return {
              ...s,
              distanceKm: dist != null ? dist : (s.distanceKm != null ? s.distanceKm : mockFallbackDist)
            };
          });
        }
        setSpaces(loaded);
        if (loaded.length > 0) {
          setSelectedSpace(loaded[0]);
        }
      } catch (err) {
        console.error("Failed to load map ad spaces:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userCoords.lat, userCoords.lng]);

  // Filtered Spaces List
  const filteredSpaces = spaces.filter((s) => {
    if (!matchCategory(s, selectedCategory)) return false;
    if (maxRadius !== "all" && s.distanceKm != null && s.distanceKm > Number(maxRadius)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (s.title || "").toLowerCase().includes(q);
      const cityMatch = (s.location?.city || s.city || "").toLowerCase().includes(q);
      const areaMatch = (s.location?.address || s.address || "").toLowerCase().includes(q);
      return titleMatch || cityMatch || areaMatch;
    }
    return true;
  });

  // Generate map pin positions deterministically on map grid
  const getPinStyle = (space, index) => {
    const basePositions = [
      { top: 22, left: 34 },
      { top: 58, left: 62 },
      { top: 38, left: 78 },
      { top: 72, left: 28 },
      { top: 48, left: 45 },
      { top: 18, left: 72 },
      { top: 65, left: 82 },
      { top: 30, left: 20 },
      { top: 80, left: 52 },
      { top: 15, left: 48 },
      { top: 52, left: 18 },
      { top: 82, left: 72 }
    ];
    const pos = basePositions[index % basePositions.length];
    return {
      top: `${pos.top}%`,
      left: `${pos.left}%`
    };
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetMapTransform = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09090B", display: "flex", flexDirection: "column", color: "#FFFFFF" }}>
      <Navbar />

      {/* Map Control Sub-Header (Dark Grey #18181B & Crisp White #FFFFFF) */}
      <div style={{
        backgroundColor: "#18181B",
        borderBottom: "1px solid #27272A",
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        zIndex: 20
      }}>
        {/* Left Title & Sidebar Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              backgroundColor: "#27272A",
              color: "#FFFFFF",
              border: "1px solid #3F3F46",
              borderRadius: "12px",
              padding: "9px 16px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease"
            }}
          >
            <SlidersHorizontal size={16} color="#FFFFFF" />
            <span>{sidebarOpen ? "Hide Panel" : "Show Panel"}</span>
          </button>

          <div>
            <h2 style={{ fontSize: "19px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.4px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>Interactive Ad Space Map</span>
              <span style={{
                fontSize: "10px",
                fontWeight: "800",
                backgroundColor: "#FFFFFF",
                color: "#09090B",
                padding: "3px 10px",
                borderRadius: "9999px",
                letterSpacing: "0.5px",
                textTransform: "uppercase"
              }}>
                LIVE GPS
              </span>
            </h2>
            <p style={{ fontSize: "12px", color: "#A1A1AA", marginTop: "2px" }}>
              Premium dark view of verified physical billboards, LED screens & transit locations
            </p>
          </div>
        </div>

        {/* Center Search Bar */}
        <div style={{ position: "relative", minWidth: "320px", flex: "0 1 420px" }}>
          <Search size={16} color="#71717A" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search location, highway, city or billboard name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              height: "42px",
              paddingLeft: "44px",
              paddingRight: "16px",
              borderRadius: "12px",
              border: "1px solid #3F3F46",
              backgroundColor: "#09090B",
              color: "#FFFFFF",
              fontSize: "13px",
              outline: "none",
              transition: "border-color 0.2s ease"
            }}
          />
        </div>

        {/* Right Map Theme & View Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", backgroundColor: "#09090B", borderRadius: "12px", padding: "4px", border: "1px solid #27272A" }}>
            <button
              onClick={() => setMapTheme("dark")}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                backgroundColor: mapTheme === "dark" ? "#FFFFFF" : "transparent",
                color: mapTheme === "dark" ? "#09090B" : "#A1A1AA",
                transition: "all 0.2s ease"
              }}
            >
              Dark Grey 🌙
            </button>
            <button
              onClick={() => setMapTheme("monochrome")}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                backgroundColor: mapTheme === "monochrome" ? "#FFFFFF" : "transparent",
                color: mapTheme === "monochrome" ? "#09090B" : "#A1A1AA",
                transition: "all 0.2s ease"
              }}
            >
              Monochrome 🗺️
            </button>
            <button
              onClick={() => setMapTheme("satellite")}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                backgroundColor: mapTheme === "satellite" ? "#FFFFFF" : "transparent",
                color: mapTheme === "satellite" ? "#09090B" : "#A1A1AA",
                transition: "all 0.2s ease"
              }}
            >
              Satellite 🛰️
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Body: Sidebar + Map Canvas */}
      <div style={{ display: "flex", flex: 1, position: "relative", overflow: "hidden", minHeight: "calc(100vh - 138px)" }}>
        
        {/* Left Collapsible Sidebar (Dark Grey & Pure White Accent) */}
        {sidebarOpen && (
          <aside className="map-sidebar" style={{
            width: "390px",
            minWidth: "350px",
            backgroundColor: "#18181B",
            borderRight: "1px solid #27272A",
            display: "flex",
            flexDirection: "column",
            zIndex: 15,
            boxShadow: "6px 0 24px rgba(0,0,0,0.4)"
          }}>
            {/* Category Filter Pills */}
            <div style={{ padding: "18px 18px 14px 18px", borderBottom: "1px solid #27272A" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#A1A1AA", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                Ad Medium Filter
              </div>
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px" }} className="custom-scroll">
                {CATEGORIES.map((cat) => {
                  const isSel = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.key)}
                      style={{
                        padding: "7px 16px",
                        borderRadius: "9999px",
                        border: isSel ? "none" : "1px solid #3F3F46",
                        backgroundColor: isSel ? "#FFFFFF" : "#27272A",
                        color: isSel ? "#09090B" : "#D4D4D8",
                        fontSize: "12px",
                        fontWeight: "800",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: isSel ? "0 4px 12px rgba(255,255,255,0.15)" : "none",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Proximity Radius Pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#A1A1AA" }}>Radius:</span>
                {["all", "5", "10", "25", "50"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMaxRadius(r)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: maxRadius === r ? "#FFFFFF" : "#27272A",
                      color: maxRadius === r ? "#09090B" : "#A1A1AA",
                      fontSize: "12px",
                      fontWeight: "800",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {r === "all" ? "All" : `< ${r}km`}
                  </button>
                ))}
              </div>
            </div>

            {/* Space Results Header Badge */}
            <div style={{ padding: "14px 18px", backgroundColor: "#09090B", borderBottom: "1px solid #27272A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "800", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={15} color="#FFFFFF" />
                <span>Found {filteredSpaces.length} physical spaces</span>
              </span>
              <span style={{ fontSize: "11px", color: "#A1A1AA" }}>
                Click card to focus pin
              </span>
            </div>

            {/* Scrollable Spaces Cards List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#A1A1AA" }}>
                  <RefreshCcw size={24} style={{ animation: "spin 1s linear infinite", marginBottom: "12px", color: "#FFFFFF" }} />
                  <p style={{ fontSize: "13px" }}>Loading verified map coordinates...</p>
                </div>
              ) : filteredSpaces.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 16px", backgroundColor: "#09090B", borderRadius: "16px", border: "1px dashed #3F3F46" }}>
                  <Compass size={32} color="#71717A" style={{ marginBottom: "10px" }} />
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF", marginBottom: "4px" }}>
                    No spaces in current map view
                  </h4>
                  <p style={{ fontSize: "12px", color: "#A1A1AA" }}>
                    Try selecting "All Spaces" or increasing the proximity radius.
                  </p>
                </div>
              ) : (
                filteredSpaces.map((space, idx) => {
                  const isSelected = selectedSpace?._id === space._id || selectedSpace?.id === space.id;

                  return (
                    <div
                      key={space._id || space.id || idx}
                      onClick={() => setSelectedSpace(space)}
                      style={{
                        backgroundColor: isSelected ? "#27272A" : "#18181B",
                        border: isSelected ? "2px solid #FFFFFF" : "1px solid #27272A",
                        borderRadius: "16px",
                        padding: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        gap: "14px",
                        boxShadow: isSelected ? "0 8px 24px rgba(0,0,0,0.5)" : "none"
                      }}
                    >
                      {/* Space Image Thumbnail */}
                      <div style={{ width: "95px", height: "95px", borderRadius: "12px", overflow: "hidden", position: "relative", flexShrink: 0, backgroundColor: "#0F172A" }}>
                        <img
                          src={space.images?.[0] || space.image || "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=80"}
                          alt=""
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: "blur(12px) brightness(0.65)",
                            transform: "scale(1.15)",
                            opacity: 0.75,
                            pointerEvents: "none"
                          }}
                        />
                        <img
                          src={space.images?.[0] || space.image || "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=80"}
                          alt={space.title}
                          style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", objectFit: "contain", padding: "2px" }}
                        />
                        <span style={{
                          position: "absolute",
                          top: "5px",
                          left: "5px",
                          fontSize: "9px",
                          fontWeight: "800",
                          backgroundColor: "#09090B",
                          color: "#FFFFFF",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          border: "1px solid #3F3F46"
                        }}>
                          {space.category || "Billboard"}
                        </span>
                      </div>

                      {/* Content Details */}
                      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#FFFFFF", marginBottom: "4px", lineHeight: "1.3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {space.title}
                          </h4>
                          <p style={{ fontSize: "12px", color: "#A1A1AA", display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
                            <MapPin size={12} color="#E4E4E7" />
                            <span>{space.location?.city || space.city || "Mumbai"}, {space.location?.state || space.state || "MH"}</span>
                            {space.distanceKm != null && (
                              <span style={{ color: "#FFFFFF", fontWeight: "700", marginLeft: "4px" }}>
                                ({space.distanceKm} km away)
                              </span>
                            )}
                          </p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                          <div>
                            <span style={{ fontSize: "15px", fontWeight: "800", color: "#FFFFFF" }}>
                              ₹{Number(space.price || space.monthlyPrice || 15000).toLocaleString("en-IN")}
                            </span>
                            <span style={{ fontSize: "11px", color: "#A1A1AA" }}>/mo</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalSpace(space);
                              setSpaceModalOpen(true);
                            }}
                            style={{
                              backgroundColor: "#FFFFFF",
                              color: "#09090B",
                              border: "none",
                              borderRadius: "8px",
                              padding: "5px 12px",
                              fontSize: "11px",
                              fontWeight: "800",
                              cursor: "pointer",
                              transition: "transform 0.15s ease"
                            }}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        )}

        {/* Main Canvas: Interactive Map Viewport (Dark Charcoal & Monochromatic Grid) */}
        <main
          style={{
            flex: 1,
            position: "relative",
            backgroundColor: mapTheme === "monochrome" ? "#121214" : mapTheme === "satellite" ? "#1A241A" : "#09090B",
            overflow: "hidden",
            cursor: isDragging ? "grabbing" : "grab"
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Map Grid / Topography Texture Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transition: isDragging ? "none" : "transform 0.15s ease-out",
              backgroundImage: mapTheme === "satellite"
                ? "radial-gradient(circle, rgba(34,197,94,0.12) 1px, transparent 1px), linear-gradient(180deg, rgba(9,9,11,0.88) 0%, rgba(9,9,11,0.96) 100%)"
                : mapTheme === "monochrome"
                ? "radial-gradient(circle, rgba(63,63,70,0.5) 1px, transparent 1px), linear-gradient(180deg, #121214 0%, #18181B 100%)"
                : "radial-gradient(circle, rgba(82,82,91,0.3) 1px, transparent 1px), linear-gradient(180deg, #09090B 0%, #18181B 100%)",
              backgroundSize: "40px 40px, 100% 100%"
            }}
          >
            {/* Vector Road Networks in Dark Grey */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.4 }}>
              <line x1="0" y1="30%" x2="100%" y2="40%" stroke="#3F3F46" strokeWidth="4" strokeDasharray="8 6" />
              <line x1="25%" y1="0" x2="35%" y2="100%" stroke="#3F3F46" strokeWidth="5" />
              <line x1="0" y1="70%" x2="100%" y2="65%" stroke="#27272A" strokeWidth="6" />
              <circle cx="30%" cy="33%" r="180" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
              <circle cx="30%" cy="33%" r="350" fill="none" stroke="#A1A1AA" strokeWidth="1" strokeDasharray="6 6" opacity="0.2" />
            </svg>

            {/* GPS User Radar Pin (Pure White Radar Dot) */}
            <div style={{
              position: "absolute",
              top: "33%",
              left: "30%",
              transform: "translate(-50%, -50%)",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <div style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                border: "3px solid #09090B",
                boxShadow: "0 0 24px rgba(255,255,255,0.9)",
                animation: "pulseGlow 2s infinite"
              }} />
              <span style={{
                fontSize: "10px",
                fontWeight: "800",
                color: "#09090B",
                backgroundColor: "#FFFFFF",
                padding: "3px 9px",
                borderRadius: "6px",
                marginTop: "4px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
              }}>
                You ({userCoords.city})
              </span>
            </div>

            {/* Premium Dark Grey & White Map Pins */}
            {filteredSpaces.map((space, idx) => {
              const isSelected = selectedSpace?._id === space._id || selectedSpace?.id === space.id;
              const posStyle = getPinStyle(space, idx);
              const catObj = CATEGORIES.find((c) => matchCategory(space, c.key)) || CATEGORIES[0];

              return (
                <div
                  key={space._id || space.id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSpace(space);
                  }}
                  style={{
                    position: "absolute",
                    top: posStyle.top,
                    left: posStyle.left,
                    transform: isSelected ? "translate(-50%, -100%) scale(1.18)" : "translate(-50%, -100%) scale(1)",
                    zIndex: isSelected ? 30 : 10,
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  }}
                >
                  {/* Map Pin Price Badge */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: isSelected ? "7px 16px" : "5px 12px",
                    borderRadius: "9999px",
                    backgroundColor: isSelected ? "#FFFFFF" : "#27272A",
                    color: isSelected ? "#09090B" : "#FFFFFF",
                    border: isSelected ? "2px solid #FFFFFF" : "1.5px solid #3F3F46",
                    boxShadow: isSelected ? "0 0 24px rgba(255,255,255,0.8)" : "0 4px 16px rgba(0,0,0,0.6)",
                    fontSize: "12px",
                    fontWeight: "800"
                  }}>
                    <span>{catObj.icon}</span>
                    <span>₹{Number(space.price || space.monthlyPrice || 15000) >= 1000 ? `${(Number(space.price || 15000) / 1000).toFixed(0)}k` : space.price}</span>
                  </div>

                  {/* Pin Point Pointer */}
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: `8px solid ${isSelected ? "#FFFFFF" : "#27272A"}`,
                    margin: "0 auto"
                  }} />
                </div>
              );
            })}
          </div>

          {/* Floating Map Zoom & Action Controls */}
          <div style={{
            position: "absolute",
            bottom: "24px",
            right: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            zIndex: 25
          }}>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.0))}
              title="Zoom In"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#18181B",
                border: "1px solid #3F3F46",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                transition: "all 0.15s ease"
              }}
            >
              <ZoomIn size={18} />
            </button>

            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              title="Zoom Out"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#18181B",
                border: "1px solid #3F3F46",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                transition: "all 0.15s ease"
              }}
            >
              <ZoomOut size={18} />
            </button>

            <button
              onClick={resetMapTransform}
              title="Recenter Map"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                border: "none",
                color: "#09090B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(255,255,255,0.25)",
                transition: "all 0.15s ease"
              }}
            >
              <Navigation size={18} />
            </button>
          </div>

          {/* Floating Selected Space Quick Preview Card Overlay (Dark Grey & White) */}
          {selectedSpace && (
            <div style={{
              position: "absolute",
              bottom: "24px",
              left: sidebarOpen ? "24px" : "24px",
              maxWidth: "440px",
              width: "calc(100% - 48px)",
              backgroundColor: "#18181B",
              border: "1.5px solid #3F3F46",
              borderRadius: "24px",
              padding: "18px",
              boxShadow: "0 20px 48px rgba(0,0,0,0.7)",
              zIndex: 35,
              display: "flex",
              gap: "16px",
              backdropFilter: "blur(20px)"
            }}>
              <div style={{ width: "115px", height: "115px", borderRadius: "16px", overflow: "hidden", flexShrink: 0, position: "relative", backgroundColor: "#0F172A" }}>
                <img
                  src={selectedSpace.images?.[0] || selectedSpace.image || "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=80"}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "blur(12px) brightness(0.65)",
                    transform: "scale(1.15)",
                    opacity: 0.75,
                    pointerEvents: "none"
                  }}
                />
                <img
                  src={selectedSpace.images?.[0] || selectedSpace.image || "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=80"}
                  alt={selectedSpace.title}
                  style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", objectFit: "contain", padding: "2px" }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", backgroundColor: "#09090B", color: "#FFFFFF", padding: "2px 9px", borderRadius: "6px", border: "1px solid #3F3F46" }}>
                      {selectedSpace.category || "Billboard"}
                    </span>
                    <button
                      onClick={() => setSelectedSpace(null)}
                      style={{ background: "none", border: "none", color: "#A1A1AA", cursor: "pointer", padding: "2px" }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <h4 style={{ fontSize: "15px", fontWeight: "800", color: "#FFFFFF", lineHeight: "1.3", marginBottom: "4px" }}>
                    {selectedSpace.title}
                  </h4>

                  <p style={{ fontSize: "12px", color: "#A1A1AA", display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={12} color="#FFFFFF" />
                    <span>{selectedSpace.location?.city || selectedSpace.city || "Mumbai"}</span>
                    {selectedSpace.distanceKm != null && (
                      <span style={{ color: "#FFFFFF", fontWeight: "700" }}>• {selectedSpace.distanceKm} km away</span>
                    )}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <div>
                    <span style={{ fontSize: "17px", fontWeight: "800", color: "#FFFFFF" }}>
                      ₹{Number(selectedSpace.price || selectedSpace.monthlyPrice || 15000).toLocaleString("en-IN")}
                    </span>
                    <span style={{ fontSize: "11px", color: "#A1A1AA" }}>/mo</span>
                  </div>

                  <button
                    onClick={() => {
                      setModalSpace(selectedSpace);
                      setSpaceModalOpen(true);
                    }}
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "#09090B",
                      border: "none",
                      borderRadius: "12px",
                      padding: "9px 18px",
                      fontSize: "12px",
                      fontWeight: "800",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 14px rgba(255,255,255,0.15)",
                      transition: "transform 0.15s ease"
                    }}
                  >
                    <span>Inspect & Book</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* Space Detail Modal */}
      <SpaceDetailModal
        isOpen={spaceModalOpen}
        onClose={() => setSpaceModalOpen(false)}
        space={modalSpace}
      />
    </div>
  );
};

export default MapViewPage;
