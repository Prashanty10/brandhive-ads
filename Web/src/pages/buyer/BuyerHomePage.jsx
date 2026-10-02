import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import SpaceCard from "../../components/buyer/SpaceCard";
import CategoryCard from "../../components/buyer/CategoryCard";
import SpaceDetailModal from "../../components/buyer/SpaceDetailModal";
import OnlinePlatformModal from "../../components/buyer/OnlinePlatformModal";
import SkeletonGrid from "../../components/common/Skeleton";
import { getHomeAdSpacesApi, searchAdSpacesApi } from "../../api/adspaceApi";
import { getFeaturedBanners } from "../../api/bannerApi";
import { ONLINE_PLATFORMS } from "../../data/onlineInformation";
import { useAuth } from "../../auth/AuthContext";
import {
  Search,
  Sparkles,
  Building2,
  Compass,
  Monitor,
  Globe,
  Share2,
  Tv,
  Layers,
  ExternalLink,
  Users,
  DollarSign,
  Info,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Navigation,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const OFFLINE_CATEGORIES = [
  { id: "all", label: "All Offline Spaces", key: "All", description: "All available physical & outdoor ad spaces" },
  { id: "billboard", label: "Billboards & Hoardings", key: "Billboard", description: "High-impact highway, unipoles & road hoardings" },
  { id: "digital", label: "Digital LED Screens", key: "Digital", description: "High-definition 4K indoor & outdoor digital billboards" },
  { id: "bus", label: "Transit & Bus Wraps", key: "Bus", description: "City buses, bus shelters & transit advertising" },
  { id: "metro", label: "Metro & Railway Ads", key: "Metro", description: "Train wraps, platform screens & metro station branding" },
  { id: "mall", label: "Mall & Retail Displays", key: "Mall", description: "Shopping mall drop banners, glass standees & atrium ads" },
  { id: "rickshaw", label: "Auto & Rickshaw Branding", key: "Rickshaw", description: "High-frequency local auto rickshaw hood & back panels" },
  { id: "airport", label: "Airport Terminal Ads", key: "Airport", description: "Flight lounge screens, luggage trolley & terminal ads" }
];

const matchCategory = (space, targetKey) => {
  if (!targetKey || targetKey === "All") return true;
  if (!space) return false;

  const sCat = (space.category || "").toLowerCase();
  const sType = (space.displayType || "").toLowerCase();
  const sTitle = (space.title || "").toLowerCase();
  const combinedStr = `${sCat} ${sType} ${sTitle}`;

  const t = targetKey.toLowerCase().trim();

  if (t === "billboard") {
    return combinedStr.includes("billboard") || combinedStr.includes("hoarding") || combinedStr.includes("unipole");
  }
  if (t === "digital") {
    return combinedStr.includes("digital") || combinedStr.includes("led") || combinedStr.includes("screen");
  }
  if (t === "bus") {
    return combinedStr.includes("bus") || combinedStr.includes("transit");
  }
  if (t === "metro") {
    return combinedStr.includes("metro") || combinedStr.includes("railway") || combinedStr.includes("train");
  }
  if (t === "mall") {
    return combinedStr.includes("mall") || combinedStr.includes("shopping") || combinedStr.includes("retail");
  }
  if (t === "rickshaw") {
    return combinedStr.includes("rickshaw") || combinedStr.includes("auto");
  }
  if (t === "airport") {
    return combinedStr.includes("airport") || combinedStr.includes("terminal") || combinedStr.includes("flight");
  }

  return combinedStr.includes(t);
};

const extractSpacesArray = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;

  const targetObj = res.data || res;
  if (targetObj && typeof targetObj === "object") {
    const combined = [
      ...(targetObj.featured || []),
      ...(targetObj.nearby || []),
      ...(targetObj.availableNow || []),
      ...(targetObj.newlyListed || []),
      ...(targetObj.bestValue || []),
      ...(targetObj.highVisibility || []),
      ...(targetObj.recommended || [])
    ];
    if (combined.length > 0) {
      return Array.from(new Map(combined.map((item) => [item._id || item.id, item])).values());
    }
  }
  return [];
};

const BuyerHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // User Location State
  const [coords, setCoords] = useState({
    lat: user?.latitude ? Number(user.latitude) : null,
    lng: user?.longitude ? Number(user.longitude) : null,
    city: user?.city || ""
  });
  const [locationLabel, setLocationLabel] = useState(user?.city ? `${user.city}${user?.state ? `, ${user.state}` : ""}` : "");

  // Top level mode: 'offline' | 'online'
  const [activeTab, setActiveTab] = useState("offline");

  // Offline filtering state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [selectedRadius, setSelectedRadius] = useState("all");

  // Online searching state
  const [onlineSearchQuery, setOnlineSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platformModalOpen, setPlatformModalOpen] = useState(false);

  // Main hero search
  const [heroSearch, setHeroSearch] = useState("");

  // Space detail modal
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [spaceModalOpen, setSpaceModalOpen] = useState(false);

  // Scroll Loading Pagination State
  const ITEMS_PER_PAGE = 9;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  // Reset visible items count when active tab, category, or search filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory, categorySearchQuery, onlineSearchQuery, activeTab]);

  // Detect GPS Location automatically
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          setCoords((prev) => ({ ...prev, lat, lng }));

          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { "User-Agent": "BrandHiveWeb/1.0" }
          })
            .then((r) => r.json())
            .then((d) => {
              if (d?.address) {
                const detectedCity = d.address.city || d.address.town || d.address.village || d.address.suburb || "";
                const detectedState = d.address.state || "";
                if (detectedCity) {
                  setCoords((prev) => ({ ...prev, city: detectedCity }));
                  setLocationLabel(`${detectedCity}${detectedState ? `, ${detectedState}` : ""}`);
                }
              }
            })
            .catch(() => {});
        },
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [searchRes, homeRes, bannersRes] = await Promise.allSettled([
          searchAdSpacesApi(),
          getHomeAdSpacesApi(),
          getFeaturedBanners()
        ]);

        let searchArr = searchRes.status === "fulfilled" ? extractSpacesArray(searchRes.value) : [];
        let homeArr = homeRes.status === "fulfilled" ? extractSpacesArray(homeRes.value) : [];

        // Merge all unique ad spaces from both endpoints
        const uniqueMap = new Map();
        [...searchArr, ...homeArr].forEach((item) => {
          const key = String(item._id || item.id);
          if (key && !uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        });

        let loadedSpaces = Array.from(uniqueMap.values());

        // Calculate distanceKm for each space if user coords exist
        if (coords.lat != null && coords.lng != null) {
          loadedSpaces = loadedSpaces.map((s) => {
            const sLat = s.location?.latitude;
            const sLng = s.location?.longitude;
            const dist = calculateDistance(coords.lat, coords.lng, sLat, sLng);
            return { ...s, distanceKm: s.distanceKm != null ? s.distanceKm : dist };
          });
        }

        setSpaces(loadedSpaces);

        if (bannersRes.status === "fulfilled" && Array.isArray(bannersRes.value?.data)) {
          setBanners(bannersRes.value.data);
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [coords.lat, coords.lng, coords.city]);

  const handleSpaceClick = (space) => {
    setSelectedSpace(space);
    setSpaceModalOpen(true);
  };

  const handleOpenPlatform = (platform) => {
    setSelectedPlatform(platform);
    setPlatformModalOpen(true);
  };

  // Category-based Offline Spaces (NO location nearby filtering or distance sorting)
  const categoryOfflineSpaces = spaces.filter((s) => {
    if (!matchCategory(s, selectedCategory)) {
      return false;
    }
    if (categorySearchQuery.trim()) {
      const q = categorySearchQuery.toLowerCase();
      const titleMatch = (s.title || "").toLowerCase().includes(q);
      const cityMatch = (s.location?.city || s.city || "").toLowerCase().includes(q);
      const stateMatch = (s.location?.state || s.state || "").toLowerCase().includes(q);
      return titleMatch || cityMatch || stateMatch;
    }
    return true;
  });

  // Nearby Offline Spaces (Sorted strictly by Proximity distance & Filtered by Selected Radius up to 100 km)
  const nearbyOfflineSpaces = spaces
    .filter((s) => {
      if (s.distanceKm == null) return false;
      if (selectedRadius === "all") return s.distanceKm <= 100;
      return s.distanceKm <= Number(selectedRadius);
    })
    .sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));

  // Online Filtered Platforms
  const filteredOnlinePlatforms = ONLINE_PLATFORMS.filter((p) => {
    if (!onlineSearchQuery.trim()) return true;
    const q = onlineSearchQuery.toLowerCase();
    const nameMatch = (p.name || "").toLowerCase().includes(q);
    const catMatch = (p.category || "").toLowerCase().includes(q);
    const subMatch = (p.subtitle || "").toLowerCase().includes(q);
    const overviewMatch = (p.shortOverview || "").toLowerCase().includes(q);
    return nameMatch || catMatch || subMatch || overviewMatch;
  });

  // Callback to load next batch of items on scroll
  const loadMoreSpaces = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 350);
  }, [isLoadingMore, ITEMS_PER_PAGE]);

  // IntersectionObserver to auto-load when sentinel comes into viewport
  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoadingMore) {
          if (activeTab === "offline" && visibleCount < categoryOfflineSpaces.length) {
            loadMoreSpaces();
          } else if (activeTab === "online" && visibleCount < filteredOnlinePlatforms.length) {
            loadMoreSpaces();
          }
        }
      },
      { threshold: 0.1, rootMargin: "250px" }
    );

    observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loaderRef.current, isLoadingMore, loading, activeTab, visibleCount, categoryOfflineSpaces.length, filteredOnlinePlatforms.length, loadMoreSpaces]);

  // Window scroll fallback listener
  useEffect(() => {
    const handleScroll = () => {
      if (loading || isLoadingMore) return;
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.offsetHeight - 600;
      if (scrollPosition >= threshold) {
        if (activeTab === "offline" && visibleCount < categoryOfflineSpaces.length) {
          loadMoreSpaces();
        } else if (activeTab === "online" && visibleCount < filteredOnlinePlatforms.length) {
          loadMoreSpaces();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, isLoadingMore, visibleCount, categoryOfflineSpaces.length, filteredOnlinePlatforms.length, activeTab, loadMoreSpaces]);

  // Slices for scroll loading pagination
  const visibleCategoryOfflineSpaces = categoryOfflineSpaces.slice(0, visibleCount);
  const visibleOnlinePlatforms = filteredOnlinePlatforms.slice(0, visibleCount);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F5", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        backgroundColor: "#111827",
        color: "#FFFFFF",
        padding: "70px 24px 85px 24px",
        minHeight: "420px",
        backgroundImage:
  "linear-gradient(180deg, rgba(17, 24, 39, 0.2) 0%, rgba(17, 24, 39, 0.4) 100%), url('https://i.pinimg.com/1200x/e3/60/b8/e360b8bcb826d37721a499bc4888e8dc.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ maxWidth: "1000px", width: "100%", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 18px",
            borderRadius: "9999px",
            backgroundColor: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            fontSize: "12px",
            fontWeight: "700",
            marginBottom: "18px",
            letterSpacing: "0.5px"
          }}>
            <Sparkles size={14} color="#60A5FA" />
            <span>INDIA'S LEADING ADVERTISING SPACE MARKETPLACE</span>
          </div>

          <h1 style={{ fontSize: "clamp(30px, 4.2vw, 50px)", fontWeight: "800", letterSpacing: "-1px", lineHeight: "1.15", marginBottom: "16px" }}>
            Find offline & online advertising spaces that get seen.
          </h1>

          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", maxWidth: "620px", margin: "0 auto 32px auto", lineHeight: "1.6" }}>
            Explore verified billboards, transit wraps, shopping mall displays, LED screens, and digital platforms across top cities.
          </p>

          {/* Search Box */}
          <div className="responsive-hero-search">
            <Search size={20} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search by city, billboard, mall, transit, or online platform..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && heroSearch.trim()) {
                  navigate(`/buyer/discover?q=${encodeURIComponent(heroSearch.trim())}`);
                }
              }}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "16px",
                color: "#111827",
                padding: "4px 0"
              }}
            />
            <button
              onClick={() => navigate(`/buyer/discover?q=${encodeURIComponent(heroSearch.trim())}`)}
              className="btn btn-blue"
              style={{ padding: "14px 28px", fontSize: "16px", borderRadius: "14px", fontWeight: "700" }}
            >
              Explore Spaces
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="responsive-container" style={{ flex: 1 }}>

        {/* Section Header & Segmented Tab Switcher (Offline vs Online) */}
        <section style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h3 style={{ fontSize: "24px", fontWeight: "900", color: "#111827", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                  Browse by Advertising Medium
                </h3>
                <p style={{ fontSize: "14px", color: "#6B7280" }}>
                  Explore physical offline spaces or digital online promotional platforms
                </p>
              </div>

              {/* Segment Switcher */}
              <div style={{
                display: "inline-flex",
                backgroundColor: "#E5E7EB",
                padding: "4px",
                borderRadius: "14px",
                gap: "4px"
              }}>
                <button
                  onClick={() => {
                    setActiveTab("offline");
                    setSelectedCategory("All");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 24px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: activeTab === "offline" ? "#FFFFFF" : "transparent",
                    color: activeTab === "offline" ? "#111827" : "#6B7280",
                    fontWeight: activeTab === "offline" ? "800" : "600",
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: activeTab === "offline" ? "0 4px 12px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Building2 size={18} color={activeTab === "offline" ? "#2563EB" : "#6B7280"} />
                  <span>Offline Advertising</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("online");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 24px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: activeTab === "online" ? "#FFFFFF" : "transparent",
                    color: activeTab === "online" ? "#111827" : "#6B7280",
                    fontWeight: activeTab === "online" ? "800" : "600",
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: activeTab === "online" ? "0 4px 12px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Globe size={18} color={activeTab === "online" ? "#7C3AED" : "#6B7280"} />
                  <span>Online Advertising</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: OFFLINE ADVERTISING */}
            {activeTab === "offline" && (
              <div>
                {/* Offline Categories Grid with Real Space Counts */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                  {OFFLINE_CATEGORIES.map((cat) => {
                    const count = cat.key === "All"
                      ? spaces.length
                      : spaces.filter((s) => matchCategory(s, cat.key)).length;

                    return (
                      <CategoryCard
                        key={cat.id}
                        category={cat.label}
                        count={count}
                        description={cat.description}
                        isSelected={selectedCategory === cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                      />
                    );
                  })}
                </div>

                {/* Category Header Bar */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "12px"
                }}>
                  <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#111827" }}>
                    {selectedCategory === "All" ? "All Category Spaces" : `${OFFLINE_CATEGORIES.find(c => c.key === selectedCategory)?.label || selectedCategory} Spaces`}
                  </h4>

                  {selectedCategory !== "All" && (
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="btn btn-secondary btn-sm"
                    >
                      Show All Categories
                    </button>
                  )}
                </div>

                {/* Offline Category Spaces Grid */}
                {loading ? (
                  <SkeletonGrid count={6} />
                ) : categoryOfflineSpaces.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 24px", backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E5E7EB", marginBottom: "48px" }}>
                    <Compass size={40} color="#9CA3AF" style={{ marginBottom: "12px" }} />
                    <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
                      0 available spaces in this category
                    </h4>
                    <p style={{ fontSize: "14px", color: "#6B7280" }}>
                      There are currently no listed spaces in {selectedCategory === "All" ? "offline advertising" : selectedCategory}. Select another category to explore available options.
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                      gap: "24px",
                      marginBottom: "32px"
                    }}>
                      {visibleCategoryOfflineSpaces.map((space) => (
                        <SpaceCard
                          key={space._id || space.id || Math.random()}
                          space={space}
                          onClick={handleSpaceClick}
                        />
                      ))}
                    </div>

                    {/* Scroll Loading Pagination Sentinel & Indicator */}
                    {visibleCount < categoryOfflineSpaces.length ? (
                      <div
                        ref={loaderRef}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "20px 0 48px 0",
                          gap: "12px"
                        }}
                      >
                        {isLoadingMore ? (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "12px 24px",
                            borderRadius: "9999px",
                            backgroundColor: "#EFF6FF",
                            border: "1px solid #BFDBFE",
                            color: "#1D4ED8",
                            fontWeight: "700",
                            fontSize: "14px",
                            boxShadow: "0 4px 12px rgba(37,99,235,0.08)"
                          }}>
                            <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} />
                            <span>Loading more advertising spaces ({Math.min(visibleCount, categoryOfflineSpaces.length)} of {categoryOfflineSpaces.length})...</span>
                          </div>
                        ) : (
                          <button
                            onClick={loadMoreSpaces}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "12px 28px",
                              borderRadius: "9999px",
                              backgroundColor: "#FFFFFF",
                              border: "1px solid #D1D5DB",
                              color: "#374151",
                              fontWeight: "700",
                              fontSize: "14px",
                              cursor: "pointer",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <span>Scroll to load more ({categoryOfflineSpaces.length - visibleCount} remaining)</span>
                            <ArrowRight size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      categoryOfflineSpaces.length > 0 && (
                        <div style={{
                          textAlign: "center",
                          padding: "20px 0 48px 0",
                          color: "#6B7280",
                          fontSize: "13px",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px"
                        }}>
                          <CheckCircle2 size={16} color="#10B981" />
                          <span>You've reached the end — showing all {categoryOfflineSpaces.length} advertising spaces</span>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB CONTENT: ONLINE ADVERTISING */}
            {activeTab === "online" && (
              <div>
                {/* Search Bar inside Online Advertising */}
                <div style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px 24px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                  marginBottom: "32px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#111827" }}>
                        Digital Media & Online Promotional Platforms
                      </h4>
                      <p style={{ fontSize: "13px", color: "#6B7280" }}>
                        Comprehensive guide & options for digital search, social media, video & B2B campaigns
                      </p>
                    </div>
                  </div>

                  <div style={{ position: "relative" }}>
                    <Search size={18} color="#9CA3AF" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      placeholder="Search online platforms (e.g. Google Ads, Meta Ads, YouTube, LinkedIn, Influencer)..."
                      value={onlineSearchQuery}
                      onChange={(e) => setOnlineSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        height: "46px",
                        paddingLeft: "46px",
                        paddingRight: "16px",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#F9FAFB",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                {/* Online Platforms Showcase Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "24px",
                  marginBottom: "32px"
                }}>
                  {visibleOnlinePlatforms.map((platform) => (
                    <div
                      key={platform.id}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "20px",
                        border: "1px solid #E5E7EB",
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: platform.iconColor || "#2563EB",
                            backgroundColor: platform.bgTint || "#EFF6FF",
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            textTransform: "uppercase"
                          }}>
                            {platform.category}
                          </span>

                          {platform.audienceReach?.activeUsers && (
                            <span style={{ fontSize: "12px", fontWeight: "700", color: "#059669", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Users size={14} />
                              {platform.audienceReach.activeUsers}
                            </span>
                          )}
                        </div>

                        <h4 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "6px" }}>
                          {platform.name}
                        </h4>

                        <p style={{ fontSize: "13px", fontWeight: "600", color: "#2563EB", marginBottom: "12px" }}>
                          {platform.subtitle}
                        </p>

                        <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.5", marginBottom: "20px" }}>
                          {platform.shortOverview}
                        </p>

                        {/* Pricing snippet */}
                        {platform.pricingModel && (
                          <div style={{ backgroundColor: "#F9FAFB", padding: "12px", borderRadius: "12px", marginBottom: "20px", fontSize: "12px", color: "#374151" }}>
                            <p style={{ fontWeight: "700", color: "#111827", marginBottom: "2px" }}>
                              Est. Pricing: {platform.pricingModel.cpc || platform.pricingModel.cpm}
                            </p>
                            <p style={{ color: "#6B7280" }}>
                              Recommended Daily: {platform.pricingModel.dailyBudget || "Flexible"}
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleOpenPlatform(platform)}
                        className="btn btn-secondary btn-md"
                        style={{ width: "100%", marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                      >
                        <span>View Platform Details & Guide</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Scroll Loading Pagination Sentinel & Indicator for Online Tab */}
                {visibleCount < filteredOnlinePlatforms.length ? (
                  <div
                    ref={loaderRef}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px 0 48px 0",
                      gap: "12px"
                    }}
                  >
                    {isLoadingMore ? (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 24px",
                        borderRadius: "9999px",
                        backgroundColor: "#F3E8FF",
                        border: "1px solid #E9D5FF",
                        color: "#7C3AED",
                        fontWeight: "700",
                        fontSize: "14px"
                      }}>
                        <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} />
                        <span>Loading more platforms ({Math.min(visibleCount, filteredOnlinePlatforms.length)} of {filteredOnlinePlatforms.length})...</span>
                      </div>
                    ) : (
                      <button
                        onClick={loadMoreSpaces}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px 28px",
                          borderRadius: "9999px",
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #D1D5DB",
                          color: "#374151",
                          fontWeight: "700",
                          fontSize: "14px",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                        }}
                      >
                        <span>Scroll to load more platforms ({filteredOnlinePlatforms.length - visibleCount} remaining)</span>
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  filteredOnlinePlatforms.length > 0 && (
                    <div style={{
                      textAlign: "center",
                      padding: "20px 0 48px 0",
                      color: "#6B7280",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}>
                      <CheckCircle2 size={16} color="#10B981" />
                      <span>Showing all {filteredOnlinePlatforms.length} digital media & online promotional platforms</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Offline Space Detail Modal */}
      <SpaceDetailModal
        isOpen={spaceModalOpen}
        onClose={() => setSpaceModalOpen(false)}
        space={selectedSpace}
      />

      {/* Online Platform Information Modal */}
      <OnlinePlatformModal
        isOpen={platformModalOpen}
        onClose={() => setPlatformModalOpen(false)}
        platform={selectedPlatform}
      />
    </div>
  );
};

export default BuyerHomePage;
