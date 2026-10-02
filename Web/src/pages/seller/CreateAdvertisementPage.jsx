import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/seller/Sidebar";
import { createAdSpaceApi, updateAdSpaceApi, getAdSpaceByIdApi } from "../../api/adspaceApi";
import {
  Megaphone,
  MapPin,
  Compass,
  Navigation,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Users,
  Eye,
  Building2,
  DollarSign,
  Clock,
  Layers,
  UploadCloud,
  Edit3
} from "lucide-react";

const CATEGORY_OPTIONS = [
  { id: "billboard", label: "Billboards & Hoardings", key: "Billboard", icon: "🏙️" },
  { id: "digital", label: "Digital LED Screens", key: "Digital", icon: "📺" },
  { id: "bus", label: "Transit & Bus Wraps", key: "Bus", icon: "🚌" },
  { id: "metro", label: "Metro & Railway Ads", key: "Metro", icon: "🚆" },
  { id: "mall", label: "Mall & Retail Displays", key: "Mall", icon: "🛍️" },
  { id: "rickshaw", label: "Auto & Rickshaw Branding", key: "Rickshaw", icon: "🛺" },
  { id: "airport", label: "Airport Terminal Ads", key: "Airport", icon: "✈️" },
  { id: "wallscape", label: "Wallscape & Posters", key: "Wallscape", icon: "🏢" },
  { id: "online", label: "Digital & Social Media", key: "Online", icon: "🌐" }
];

const DISPLAY_TYPES = [
  "Billboard",
  "Hoarding",
  "Unipole",
  "Digital LED Screen",
  "Bus Wrap",
  "Bus Shelter",
  "Metro Station Banner",
  "Mall Kiosk / Standee",
  "Auto Rickshaw Panel",
  "Airport Lounge Display",
  "Wallscape Banner",
  "Social Media Promotion"
];

const PRICE_UNITS = ["per day", "per week", "per month", "per campaign"];
const BOOKING_TYPES = ["Instant Booking", "Request Booking"];
const MINIMUM_DURATIONS = ["1 day", "3 days", "1 week", "2 weeks", "1 month"];

const AUDIENCE_OPTIONS = [
  "Students",
  "Families",
  "Professionals",
  "Shoppers",
  "Tourists",
  "Commuters",
  "General Public"
];

const AMENITY_OPTIONS = [
  "High Traffic Junction",
  "Main Arterial Road",
  "24/7 Illumination",
  "Parking Nearby",
  "CCTV Monitored",
  "HD Digital Screen",
  "Weather Protected"
];

const CreateAdvertisementPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  // Basic Details
  const [title, setTitle] = useState("");
  const [categoryKey, setCategoryKey] = useState("Billboard");
  const [displayType, setDisplayType] = useState("Billboard");
  const [description, setDescription] = useState("");

  // Pricing & Booking
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("per month");
  const [bookingType, setBookingType] = useState("Instant Booking");
  const [minimumBookingDuration, setMinimumBookingDuration] = useState("1 week");

  // Footfall & Audience
  const [estimatedDailyImpressions, setEstimatedDailyImpressions] = useState("");
  const [estimatedFootfall, setEstimatedFootfall] = useState("");
  const [selectedAudience, setSelectedAudience] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Location & Coordinates
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Specifications
  const [lightingType, setLightingType] = useState("Frontlit");
  const [dimensions, setDimensions] = useState("20ft x 10ft");

  // Media Images
  const [currentImageInput, setCurrentImageInput] = useState("");
  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=800&auto=format&fit=crop&q=80"
  ]);

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [fetchingEditData, setFetchingEditData] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load space details if in edit mode
  useEffect(() => {
    if (!editId) return;
    const fetchEditData = async () => {
      try {
        setFetchingEditData(true);
        const res = await getAdSpaceByIdApi(editId);
        const data = res?.data || res;
        if (data) {
          if (data.title) setTitle(data.title);
          if (data.category) setCategoryKey(data.category);
          if (data.displayType) setDisplayType(data.displayType);
          if (data.description) setDescription(data.description);
          if (data.price) setPrice(String(data.price));
          if (data.priceUnit) setPriceUnit(data.priceUnit);
          if (data.bookingType) setBookingType(data.bookingType);
          if (data.minimumBookingDuration) setMinimumBookingDuration(data.minimumBookingDuration);
          if (data.estimatedDailyImpressions) setEstimatedDailyImpressions(data.estimatedDailyImpressions);
          if (data.estimatedFootfall) setEstimatedFootfall(data.estimatedFootfall);
          if (Array.isArray(data.targetAudience)) setSelectedAudience(data.targetAudience);
          if (Array.isArray(data.amenities)) setSelectedAmenities(data.amenities);

          const loc = data.location || {};
          if (loc.city || data.city) setCity(loc.city || data.city || "");
          if (loc.state || data.state) setState(loc.state || data.state || "");
          if (loc.address || data.address) setAddress(loc.address || data.address || "");
          if (loc.latitude != null || data.latitude != null) setLatitude(String(loc.latitude ?? data.latitude));
          if (loc.longitude != null || data.longitude != null) setLongitude(String(loc.longitude ?? data.longitude));

          const specs = data.specifications || {};
          if (specs.lightingType) setLightingType(specs.lightingType);
          if (specs.dimensions) setDimensions(specs.dimensions);

          if (Array.isArray(data.images) && data.images.length > 0) {
            setImages(data.images);
          }
        }
      } catch (err) {
        console.error("Failed to load edit ad space:", err);
        setError("Failed to load space data for editing.");
      } finally {
        setFetchingEditData(false);
      }
    };
    fetchEditData();
  }, [editId]);

  const toggleAudience = (aud) => {
    setSelectedAudience((prev) =>
      prev.includes(aud) ? prev.filter((a) => a !== aud) : [...prev, aud]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(e.target?.result);
        img.src = e.target?.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
      try {
        const compressedDataUrl = await compressImage(file);
        setImages((prev) => [...prev, compressedDataUrl]);
      } catch (err) {
        console.error("Image processing error:", err);
      }
    }
    e.target.value = "";
  };

  const handleMakePrimary = (idx) => {
    setImages((prev) => {
      const target = prev[idx];
      const remaining = prev.filter((_, i) => i !== idx);
      return [target, ...remaining];
    });
  };

  const handleAddImage = () => {
    if (!currentImageInput.trim()) return;
    setImages((prev) => [...prev, currentImageInput.trim()]);
    setCurrentImageInput("");
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setLatitude(String(lat));
        setLongitude(String(lng));

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { "User-Agent": "BrandHiveWeb/1.0" } }
          );
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            const detectedCity = addr.city || addr.town || addr.village || addr.suburb || "";
            const detectedState = addr.state || "";
            const street = [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(", ");

            if (detectedCity) setCity(detectedCity);
            if (detectedState) setState(detectedState);
            if (street && !address) setAddress(street);
          }
        } catch (e) {
          console.log("GPS reverse geocode error:", e);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError("Unable to retrieve GPS coordinates. Please check browser permissions.");
        setLocating(false);
      }
    );
  };

  const handleAnalyseCoords = async () => {
    if (!city.trim() && !state.trim()) {
      setError("Please enter a City or State to calculate coordinates.");
      return;
    }
    setLocating(true);
    setError("");
    try {
      const query = [address.trim(), city.trim(), state.trim()].filter(Boolean).join(", ");
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        { headers: { "User-Agent": "BrandHiveWeb/1.0" } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setLatitude(String(parseFloat(data[0].lat).toFixed(6)));
        setLongitude(String(parseFloat(data[0].lon).toFixed(6)));
      } else {
        setError(`Could not analyze coordinates for "${query}".`);
      }
    } catch (e) {
      setError("Failed to analyze coordinates.");
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !price.trim() || !city.trim() || !state.trim()) {
      setError("Title, Price, City, and State are required fields.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        category: categoryKey,
        displayType,
        price: Number(price),
        priceUnit,
        bookingType,
        minimumBookingDuration,
        estimatedDailyImpressions: estimatedDailyImpressions.trim() || "10,000+",
        estimatedFootfall: estimatedFootfall.trim() || "5,000+",
        targetAudience: selectedAudience,
        amenities: selectedAmenities,
        description: description.trim(),
        city: city.trim(),
        state: state.trim(),
        address: address.trim(),
        latitude: latitude.trim() ? parseFloat(latitude.trim()) : undefined,
        longitude: longitude.trim() ? parseFloat(longitude.trim()) : undefined,
        location: {
          city: city.trim(),
          state: state.trim(),
          address: address.trim(),
          latitude: latitude.trim() ? parseFloat(latitude.trim()) : undefined,
          longitude: longitude.trim() ? parseFloat(longitude.trim()) : undefined
        },
        specifications: {
          lightingType,
          dimensions
        },
        images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=800&auto=format&fit=crop&q=80"]
      };

      if (editId) {
        await updateAdSpaceApi(editId, payload);
      } else {
        await createAdSpaceApi(payload);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/seller/advertisements");
      }, 1200);
    } catch (err) {
      setError(err?.message || `Failed to ${editId ? "update" : "publish"} ad space. Please verify all fields.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F7F7F5" }} className="seller-layout">
      <Sidebar />

      <main className="seller-main-content">
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ marginBottom: "28px" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Seller Inventory Management
            </span>
            <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#111827", letterSpacing: "-0.5px", marginTop: "4px" }}>
              {editId ? "Edit Advertising Space Listing" : "List New Advertising Space"}
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>
              {editId ? "Update pricing, specifications, location & media details of your space listing." : "Add verified physical hoardings, LED displays, transit wraps, or digital promotional media."}
            </p>
          </div>

          <div className="responsive-form-card">
            {error && (
              <div style={{ padding: "14px 18px", borderRadius: "12px", backgroundColor: "#FEF2F2", color: "#EF4444", fontSize: "13px", fontWeight: "600", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={{ padding: "14px 18px", borderRadius: "12px", backgroundColor: "#ECFDF5", color: "#059669", fontSize: "13px", fontWeight: "700", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={18} />
                <span>Ad space published successfully! Redirecting to inventory dashboard...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* SECTION 1: Category Selection */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: "800", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px", display: "block" }}>
                  1. Choose Advertising Category *
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "10px" }}>
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = categoryKey === cat.key;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategoryKey(cat.key);
                          if (cat.key === "Billboard") setDisplayType("Billboard");
                          if (cat.key === "Digital") setDisplayType("Digital LED Screen");
                          if (cat.key === "Bus") setDisplayType("Bus Wrap");
                          if (cat.key === "Metro") setDisplayType("Metro Station Banner");
                          if (cat.key === "Mall") setDisplayType("Mall Kiosk / Standee");
                          if (cat.key === "Rickshaw") setDisplayType("Auto Rickshaw Panel");
                          if (cat.key === "Airport") setDisplayType("Airport Lounge Display");
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "12px 14px",
                          borderRadius: "14px",
                          fontSize: "13px",
                          fontWeight: isSelected ? "800" : "600",
                          color: isSelected ? "#2563EB" : "#374151",
                          backgroundColor: isSelected ? "#EFF6FF" : "#F9FAFB",
                          border: isSelected ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease"
                        }}
                      >
                        <span style={{ fontSize: "18px" }}>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: Title & Display Type */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px", display: "block" }}>
                    Space Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unipole Billboard at Western Express Highway"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: "100%",
                      height: "44px",
                      padding: "0 14px",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px", display: "block" }}>
                    Specific Display Type
                  </label>
                  <select
                    value={displayType}
                    onChange={(e) => setDisplayType(e.target.value)}
                    style={{
                      width: "100%",
                      height: "44px",
                      padding: "0 14px",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#FFFFFF"
                    }}
                  >
                    {DISPLAY_TYPES.map((dt) => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION 3: Pricing & Booking Structure */}
              <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "18px", padding: "20px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#111827", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <DollarSign size={16} color="#2563EB" />
                  <span>Pricing & Booking Configuration</span>
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#4B5563", marginBottom: "4px", display: "block" }}>
                      Rate Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 25000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        fontSize: "14px",
                        fontWeight: "700"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#4B5563", marginBottom: "4px", display: "block" }}>
                      Price Unit
                    </label>
                    <select
                      value={priceUnit}
                      onChange={(e) => setPriceUnit(e.target.value)}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 10px",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        fontSize: "13px"
                      }}
                    >
                      {PRICE_UNITS.map((pu) => (
                        <option key={pu} value={pu}>{pu}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#4B5563", marginBottom: "4px", display: "block" }}>
                      Booking Mode
                    </label>
                    <select
                      value={bookingType}
                      onChange={(e) => setBookingType(e.target.value)}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 10px",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        fontSize: "13px"
                      }}
                    >
                      {BOOKING_TYPES.map((bt) => (
                        <option key={bt} value={bt}>{bt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#4B5563", marginBottom: "4px", display: "block" }}>
                      Min. Duration
                    </label>
                    <select
                      value={minimumBookingDuration}
                      onChange={(e) => setMinimumBookingDuration(e.target.value)}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 10px",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        fontSize: "13px"
                      }}
                    >
                      {MINIMUM_DURATIONS.map((md) => (
                        <option key={md} value={md}>{md}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Location & GPS */}
              <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: "18px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#1E40AF", display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={18} color="#2563EB" />
                      <span>Physical Location & GPS Coordinates</span>
                    </h4>
                    <p style={{ fontSize: "12px", color: "#3B82F6", marginTop: "2px" }}>
                      Required for nearby proximity search & buyer navigation
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button type="button" onClick={handleDetectGPS} disabled={locating} className="btn btn-secondary btn-sm" style={{ backgroundColor: "#FFFFFF", fontSize: "12px" }}>
                      <Navigation size={14} color="#2563EB" />
                      <span>{locating ? "Locating..." : "Detect GPS"}</span>
                    </button>

                    <button type="button" onClick={handleAnalyseCoords} disabled={locating} className="btn btn-secondary btn-sm" style={{ backgroundColor: "#FFFFFF", fontSize: "12px" }}>
                      <Compass size={14} color="#2563EB" />
                      <span>Analyse Coords</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#1E40AF", marginBottom: "4px", display: "block" }}>City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid #BFDBFE", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#1E40AF", marginBottom: "4px", display: "block" }}>State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharashtra"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{ width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid #BFDBFE", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#1E40AF", marginBottom: "4px", display: "block" }}>Street Address / Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite Terminal 2, Airport Road"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid #BFDBFE", fontSize: "14px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#1E40AF" }}>Latitude</label>
                    <input
                      type="text"
                      placeholder="19.0760"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      style={{ width: "100%", height: "36px", padding: "0 10px", borderRadius: "8px", border: "1px solid #BFDBFE", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#1E40AF" }}>Longitude</label>
                    <input
                      type="text"
                      placeholder="72.8777"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      style={{ width: "100%", height: "36px", padding: "0 10px", borderRadius: "8px", border: "1px solid #BFDBFE", fontSize: "13px" }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Traffic & Audience Highlights */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px", display: "block" }}>
                    Est. Daily Impressions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50,000+ views/day"
                    value={estimatedDailyImpressions}
                    onChange={(e) => setEstimatedDailyImpressions(e.target.value)}
                    style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px", display: "block" }}>
                    Est. Daily Footfall
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20,000+ people/day"
                    value={estimatedFootfall}
                    onChange={(e) => setEstimatedFootfall(e.target.value)}
                    style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "13px" }}
                  />
                </div>
              </div>

              {/* Target Audience Checkboxes */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px", display: "block" }}>
                  Target Audience Segments
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {AUDIENCE_OPTIONS.map((aud) => {
                    const isSel = selectedAudience.includes(aud);
                    return (
                      <button
                        key={aud}
                        type="button"
                        onClick={() => toggleAudience(aud)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: isSel ? "700" : "500",
                          backgroundColor: isSel ? "#2563EB" : "#F3F4F6",
                          color: isSel ? "#FFFFFF" : "#4B5563",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        {isSel ? "✓ " : "+ "}{aud}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amenities Checkboxes */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px", display: "block" }}>
                  Key Amenities & Highlights
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {AMENITY_OPTIONS.map((amenity) => {
                    const isSel = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: isSel ? "700" : "500",
                          backgroundColor: isSel ? "#059669" : "#F3F4F6",
                          color: isSel ? "#FFFFFF" : "#4B5563",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        {isSel ? "✓ " : "+ "}{amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 6: Specifications */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px", display: "block" }}>
                    Lighting Type
                  </label>
                  <select
                    value={lightingType}
                    onChange={(e) => setLightingType(e.target.value)}
                    style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "13px" }}
                  >
                    <option value="Frontlit">Frontlit</option>
                    <option value="Backlit">Backlit</option>
                    <option value="Digital 4K LED">Digital 4K LED</option>
                    <option value="Non-lit">Non-lit</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px", display: "block" }}>
                    Dimensions (W x H)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20ft x 10ft"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "13px" }}
                  />
                </div>
              </div>

              {/* SECTION 7: Image Media Uploads (Multiple File & URL Uploads) */}
              <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "18px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#111827", display: "flex", alignItems: "center", gap: "6px" }}>
                      <ImageIcon size={18} color="#2563EB" />
                      <span>Ad Space Photos & Banner Media (Upload Multiple Photos)</span>
                    </h4>
                    <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
                      Select photos from your device/computer or paste web image URLs. First image will be used as the primary cover banner.
                    </p>
                  </div>

                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#2563EB", backgroundColor: "#EFF6FF", padding: "4px 12px", borderRadius: "9999px" }}>
                    {images.length} Photo{images.length === 1 ? "" : "s"} Uploaded
                  </span>
                </div>

                {/* Upload Buttons Box */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
                  {/* File Upload Box */}
                  <label style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px 16px",
                    border: "2px dashed #3B82F6",
                    borderRadius: "14px",
                    backgroundColor: "#EFF6FF",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s ease"
                  }}>
                    <UploadCloud size={28} color="#2563EB" style={{ marginBottom: "6px" }} />
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#1E40AF" }}>
                      Choose Files from Device
                    </span>
                    <span style={{ fontSize: "11px", color: "#3B82F6", marginTop: "2px" }}>
                      Upload 1 or more photos (JPG, PNG, WebP)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                  </label>

                  {/* URL Input Box */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "16px", border: "1px solid #E5E7EB", borderRadius: "14px", backgroundColor: "#FFFFFF" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
                      Or Add Image Web URL
                    </span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={currentImageInput}
                        onChange={(e) => setCurrentImageInput(e.target.value)}
                        style={{ flex: 1, height: "36px", padding: "0 10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "12px" }}
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0 12px", fontSize: "12px" }}
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Uploaded Images Gallery Grid */}
                {images.length > 0 && (
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px", display: "block" }}>
                      Current Photo Gallery ({images.length} photos) — 1st image is Primary Cover:
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px" }}>
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: "relative",
                            height: "100px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: idx === 0 ? "3px solid #2563EB" : "1px solid #E5E7EB",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                          }}
                        >
                          <img src={img} alt={`Space Banner ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                          {/* Primary Badge */}
                          {idx === 0 ? (
                            <span style={{
                              position: "absolute",
                              top: "6px",
                              left: "6px",
                              backgroundColor: "#2563EB",
                              color: "#FFFFFF",
                              fontSize: "10px",
                              fontWeight: "800",
                              padding: "2px 6px",
                              borderRadius: "6px",
                              textTransform: "uppercase"
                            }}>
                              Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMakePrimary(idx)}
                              style={{
                                position: "absolute",
                                top: "6px",
                                left: "6px",
                                backgroundColor: "rgba(17, 24, 39, 0.75)",
                                backdropFilter: "blur(4px)",
                                color: "#FFFFFF",
                                border: "none",
                                fontSize: "10px",
                                fontWeight: "700",
                                padding: "2px 6px",
                                borderRadius: "6px",
                                cursor: "pointer"
                              }}
                            >
                              Set Primary
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            style={{
                              position: "absolute",
                              top: "6px",
                              right: "6px",
                              backgroundColor: "rgba(239, 68, 68, 0.9)",
                              color: "#FFFFFF",
                              border: "none",
                              borderRadius: "50%",
                              width: "22px",
                              height: "22px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer"
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 8: Description */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px", display: "block" }}>
                  Space Description & Strategic Highlights
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe peak traffic hours, visual clear lines of sight, nearby commercial hubs, or past campaign performance..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", outline: "none", lineHeight: "1.5" }}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-blue btn-lg" style={{ width: "100%", borderRadius: "14px", fontSize: "13px" }}>
                {loading ? "Publishing Ad Space..." : "Publish Advertisement Space"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateAdvertisementPage;
