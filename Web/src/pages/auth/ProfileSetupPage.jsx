import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileSetupApi } from "../../api/authApi";
import { useAuth } from "../../auth/AuthContext";
import { User, Phone, MapPin, Compass, Sparkles, CheckCircle2, AlertCircle, Navigation } from "lucide-react";

const ProfileSetupPage = () => {
  const { user, refreshUser, activeRole } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || user?.mobile || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [latitude, setLatitude] = useState(() => {
    const lat = user?.latitude ?? user?.location?.coordinates?.[1];
    return lat != null ? String(lat) : "";
  });
  const [longitude, setLongitude] = useState(() => {
    const lng = user?.longitude ?? user?.location?.coordinates?.[0];
    return lng != null ? String(lng) : "";
  });
  const [bio, setBio] = useState(user?.bio || "");
  const [profileImage, setProfileImage] = useState(
    user?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
  );

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
      if (user.mobileNumber || user.mobile) setMobileNumber(user.mobileNumber || user.mobile);
      if (user.city) setCity(user.city);
      if (user.state) setState(user.state);
      const userLat = user.latitude ?? user.location?.coordinates?.[1];
      const userLng = user.longitude ?? user.location?.coordinates?.[0];
      if (userLat != null && userLat !== "") setLatitude(String(userLat));
      if (userLng != null && userLng !== "") setLongitude(String(userLng));
      if (user.bio) setBio(user.bio);
      if (user.profileImage) setProfileImage(user.profileImage);
    }
  }, [user]);

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
            const detectedCity = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || "";
            const detectedState = addr.state || "";
            if (detectedCity) setCity(detectedCity);
            if (detectedState) setState(detectedState);
          }
        } catch (e) {
          console.log("Reverse geocode fallback error:", e);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setError("Unable to retrieve GPS position. Please enter location manually.");
        setLocating(false);
      }
    );
  };

  const handleAnalyseCityState = async (overrideCity, overrideState, silent = false) => {
    const targetCity = (overrideCity !== undefined ? overrideCity : city).trim();
    const targetState = (overrideState !== undefined ? overrideState : state).trim();

    if (!targetCity && !targetState) {
      if (!silent) setError("Please enter a City or State to analyze coordinates.");
      return null;
    }
    setLocating(true);
    if (!silent) setError("");

    try {
      const query = [targetCity, targetState].filter(Boolean).join(", ");
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        { headers: { "User-Agent": "BrandHiveWeb/1.0" } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = String(parseFloat(data[0].lat).toFixed(6));
        const lng = String(parseFloat(data[0].lon).toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        return { latitude: parseFloat(lat), longitude: parseFloat(lng) };
      } else if (!silent) {
        setError(`Could not analyze coordinates for "${query}".`);
      }
    } catch (e) {
      if (!silent) setError("Failed to analyze location coordinates.");
    } finally {
      setLocating(false);
    }
    return null;
  };

  // Debounced auto-analysis of City & State -> Lat/Lng ONLY IF lat/lng are currently empty
  useEffect(() => {
    if (!city.trim() && !state.trim()) return;
    if (latitude.trim() && longitude.trim()) return;
    const timer = setTimeout(() => {
      handleAnalyseCityState(city, state, true);
    }, 800);
    return () => clearTimeout(timer);
  }, [city, state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First Name and Last Name are required.");
      return;
    }

    if (!city.trim() || !state.trim()) {
      setError("City and State are required.");
      return;
    }

    let latVal = latitude.trim();
    let lngVal = longitude.trim();

    if ((!latVal || !lngVal) && (city.trim() || state.trim())) {
      const geo = await handleAnalyseCityState(city.trim(), state.trim(), true);
      if (geo) {
        latVal = String(geo.latitude);
        lngVal = String(geo.longitude);
      }
    }

    try {
      setLoading(true);
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNumber: mobileNumber.trim(),
        city: city.trim(),
        state: state.trim(),
        latitude: latVal ? parseFloat(latVal) : undefined,
        longitude: lngVal ? parseFloat(lngVal) : undefined,
        bio: bio.trim(),
        profileImage,
        isProfileCompleted: true,
      };

      await profileSetupApi(payload);
      await refreshUser();
      setSuccess(true);

      setTimeout(() => {
        if (activeRole === "seller") {
          navigate("/seller/dashboard");
        } else {
          navigate("/buyer/home");
        }
      }, 1000);
    } catch (err) {
      setError(err?.message || "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F5", padding: "40px 24px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "9999px",
            backgroundColor: "#EFF6FF",
            color: "#2563EB",
            fontSize: "13px",
            fontWeight: "700",
            marginBottom: "12px"
          }}>
            <Sparkles size={16} />
            <span>Profile Onboarding</span>
          </div>

          <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#111827", letterSpacing: "-0.5px" }}>
            Complete Your Profile
          </h2>
          <p style={{ fontSize: "15px", color: "#6B7280", marginTop: "4px" }}>
            Personalize your account details and location for BrandHive.
          </p>
        </div>

        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "36px",
          boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.08)",
          border: "1px solid #E5E7EB"
        }}>
          {error && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 18px",
              borderRadius: "12px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FEE2E2",
              color: "#EF4444",
              fontSize: "13px",
              marginBottom: "24px"
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 18px",
              borderRadius: "12px",
              backgroundColor: "#ECFDF5",
              border: "1px solid #A7F3D0",
              color: "#059669",
              fontSize: "13px",
              marginBottom: "24px"
            }}>
              <CheckCircle2 size={18} />
              <span>Profile completed! Redirecting to your dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Avatar Preview */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <img
                src={profileImage}
                alt="Avatar"
                style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", border: "2px solid #2563EB" }}
              />
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                  Profile Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Name Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                Mobile Number (10 digits)
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={16} color="#9CA3AF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ""))}
                  className="input-field"
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>

            {/* Location & GPS Coordinates Section */}
            <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>
                    Location & GPS Coordinates
                  </h4>
                  <p style={{ fontSize: "12px", color: "#6B7280" }}>
                    Input location details manually or detect via GPS
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={locating}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      backgroundColor: "#111827",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    <Navigation size={12} />
                    {locating ? "Detecting..." : "Detect GPS"}
                  </button>

                  <button
                    type="button"
                    onClick={handleAnalyseCityState}
                    disabled={locating}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      backgroundColor: "#EFF6FF",
                      color: "#2563EB",
                      fontSize: "12px",
                      fontWeight: "600",
                      border: "1px solid #BFDBFE",
                      cursor: "pointer"
                    }}
                  >
                    <Compass size={12} />
                    Analyse Coords
                  </button>
                </div>
              </div>

              {/* City & State Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px", display: "block" }}>
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px", display: "block" }}>
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Latitude & Longitude Manual Entry Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px", display: "block" }}>
                    Latitude (decimal)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 19.0760"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px", display: "block" }}>
                    Longitude (decimal)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 72.8777"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "4px", display: "block" }}>
                Bio / Business Description
              </label>
              <textarea
                rows={3}
                placeholder="Tell us about your brand or advertising requirements..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  outline: "none",
                  resize: "none"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: "8px" }}
            >
              {loading ? "Saving Profile..." : "Save Profile & Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
