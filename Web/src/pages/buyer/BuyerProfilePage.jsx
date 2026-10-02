import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../auth/AuthContext";
import {
  profileSetupApi,
  changePasswordApi,
  updateNotificationPreferencesApi,
  updatePrivacySettingsApi,
  deleteAccountApi,
} from "../../api/authApi";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Compass,
  Navigation,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
  Bell,
  Eye,
  Shield,
  LogOut,
  Trash2,
  Edit,
  Camera,
  Heart,
  Calendar,
  HelpCircle,
  FileText,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";

const getAvatarUrl = (img) => {
  if (!img || typeof img !== "string") return DEFAULT_AVATAR;
  const trimmed = img.trim();
  if (!trimmed || trimmed.startsWith("file://")) return DEFAULT_AVATAR;
  return trimmed;
};

const BuyerProfilePage = () => {
  const { user, refreshUser, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  // Modals state
  const [isEditing, setIsEditing] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Edit Profile Form State
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [mobileNumber, setMobileNumber] = useState(
    user?.mobileNumber || user?.mobile || ""
  );
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [latitude, setLatitude] = useState(
    user?.latitude ? String(user.latitude) : ""
  );
  const [longitude, setLongitude] = useState(
    user?.longitude ? String(user.longitude) : ""
  );
  const [bio, setBio] = useState(user?.bio || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  // Notification Preferences State
  const [notifPrefs, setNotifPrefs] = useState({
    pushNotifications: true,
    emailNotifications: true,
    bookingUpdates: true,
    promotionalEmails: false,
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    showLocation: true,
  });

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setMobileNumber(user.mobileNumber || user.mobile || "");
      setCity(user.city || "");
      setState(user.state || "");
      if (user.latitude) setLatitude(String(user.latitude));
      if (user.longitude) setLongitude(String(user.longitude));
      setBio(user.bio || "");
      setProfileImage(user.profileImage || "");

      if (user.notificationPreferences) {
        setNotifPrefs((prev) => ({ ...prev, ...user.notificationPreferences }));
      }
      if (user.privacySettings) {
        setPrivacySettings((prev) => ({ ...prev, ...user.privacySettings }));
      }
    }
  }, [user]);

  // Handle Image File Upload for Web DP
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image file size should be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
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
            const detectedCity =
              addr.city || addr.town || addr.village || addr.suburb || "";
            const detectedState = addr.state || "";
            if (detectedCity) setCity(detectedCity);
            if (detectedState) setState(detectedState);
          }
        } catch (e) {
          console.log("GPS reverse geocode error:", e);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError("Unable to retrieve GPS coordinates.");
        setLocating(false);
      }
    );
  };

  const handleAnalyseCoords = async (overrideCity, overrideState, silent = false) => {
    const targetCity = (overrideCity !== undefined ? overrideCity : city).trim();
    const targetState = (overrideState !== undefined ? overrideState : state).trim();

    if (!targetCity && !targetState) {
      if (!silent) setError("Please enter a City or State to calculate coordinates.");
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
      if (!silent) setError("Failed to analyze coordinates.");
    } finally {
      setLocating(false);
    }
    return null;
  };

  // Debounced auto-geocoding on City/State change
  useEffect(() => {
    if (!city.trim() && !state.trim()) return;
    const timer = setTimeout(() => {
      handleAnalyseCoords(city, state, true);
    }, 800);
    return () => clearTimeout(timer);
  }, [city, state]);

  // Calculate Profile Completion Percentage
  const calculateProfileStrength = () => {
    const fields = [
      Boolean(user?.firstName),
      Boolean(user?.lastName),
      Boolean(user?.email),
      Boolean(user?.mobileNumber || user?.mobile),
      Boolean(user?.city),
      Boolean(user?.state),
      Boolean(user?.profileImage),
      Boolean(user?.bio),
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const profileStrength = calculateProfileStrength();

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    let latVal = latitude.trim();
    let lngVal = longitude.trim();

    if ((!latVal || !lngVal) && (city.trim() || state.trim())) {
      const geo = await handleAnalyseCoords(city.trim(), state.trim(), true);
      if (geo) {
        latVal = String(geo.latitude);
        lngVal = String(geo.longitude);
      }
    }

    try {
      setLoading(true);
      await profileSetupApi({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNumber: mobileNumber.trim(),
        city: city.trim(),
        state: state.trim(),
        latitude: latVal ? parseFloat(latVal) : undefined,
        longitude: lngVal ? parseFloat(lngVal) : undefined,
        bio: bio.trim(),
        profileImage,
      });
      await refreshUser();
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      setLoading(true);
      await changePasswordApi(currentPassword, newPassword);
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setTimeout(() => {
        setPasswordModalOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordMsg({ type: "", text: "" });
      }, 1200);
    } catch (err) {
      setPasswordMsg({ type: "error", text: err?.message || "Failed to change password." });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotif = async (key, val) => {
    const updated = { ...notifPrefs, [key]: val };
    setNotifPrefs(updated);
    try {
      await updateNotificationPreferencesApi(updated);
      await refreshUser();
    } catch (e) {
      setNotifPrefs(notifPrefs);
    }
  };

  const handleTogglePrivacy = async (key, val) => {
    const updated = { ...privacySettings, [key]: val };
    setPrivacySettings(updated);
    try {
      await updatePrivacySettingsApi(updated);
      await refreshUser();
    } catch (e) {
      setPrivacySettings(privacySettings);
    }
  };

  const handleSwitchToSeller = async () => {
    try {
      await switchRole("seller");
      navigate("/seller/dashboard");
    } catch (err) {
      if (window.confirm("You are not registered as a seller yet. Would you like to register as a seller now?")) {
        navigate("/profile-setup");
      }
    }
  };

  const handleDeleteAccountSubmit = async () => {
    try {
      setLoading(true);
      await deleteAccountApi();
      await logout();
      navigate("/");
    } catch (e) {
      alert(e?.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  const hasSellerRole =
    user?.roles && Array.isArray(user.roles) && user.roles.includes("seller");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="responsive-container" style={{ maxWidth: "860px", flex: 1 }}>
        {/* Page Title */}
        <div style={{ marginBottom: "24px" }}>
          <span style={{ fontSize: "12px", fontWeight: "800", color: "#2563EB", letterSpacing: "0.8px", textTransform: "uppercase" }}>
            Account Management
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0F172A", letterSpacing: "-0.5px", marginTop: "2px" }}>
            Profile
          </h1>
        </div>

        {/* Profile Hero Header Card */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          marginBottom: "20px",
          position: "relative",
        }}>
          {/* Cover Accent Banner */}
          <div style={{ height: "90px", backgroundColor: "#2563EB", background: "linear-gradient(90deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)" }} />

          <div style={{ padding: "0 28px 24px 28px", marginTop: "-44px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "16px" }}>
                <div style={{ position: "relative" }}>
                  <img
                    src={getAvatarUrl(user?.profileImage)}
                    alt="User DP"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                    style={{
                      width: "88px",
                      height: "88px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "4px solid #FFFFFF",
                      backgroundColor: "#F1F5F9",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    backgroundColor: "#0F172A",
                    color: "#FFFFFF",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #FFFFFF",
                  }}>
                    <CheckCircle2 size={13} />
                  </div>
                </div>

                <div style={{ paddingBottom: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0F172A", letterSpacing: "-0.3px" }}>
                      {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "BrandHive User"}
                    </h2>
                    {/* Buyer Account Chip Badge directly beside name */}
                    <span style={{
                      fontSize: "12px",
                      fontWeight: "800",
                      color: "#2563EB",
                      backgroundColor: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}>
                      <User size={12} /> Buyer Account
                    </span>
                  </div>
                  {user?.username ? (
                    <p style={{ fontSize: "13px", color: "#64748B", fontWeight: "500", marginTop: "2px" }}>
                      @{user.username}
                    </p>
                  ) : null}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "9px 18px",
                    borderRadius: "12px",
                    backgroundColor: "#0F172A",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: "700",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <Edit size={14} />
                  {isEditing ? "Close Edit" : "Edit Profile"}
                </button>

                <button
                  type="button"
                  onClick={handleSwitchToSeller}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "9px 18px",
                    borderRadius: "12px",
                    backgroundColor: "#EFF6FF",
                    color: "#2563EB",
                    fontSize: "13px",
                    fontWeight: "700",
                    border: "1px solid #BFDBFE",
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw size={14} />
                  {hasSellerRole ? "Switch to Seller Mode" : "Become a Seller"}
                </button>
              </div>
            </div>

            {/* Contact Pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "#475569", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={14} color="#3B82F6" />
                <span>{user?.email || "No email specified"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={14} color="#10B981" />
                <span>{user?.mobileNumber || user?.mobile || "No phone added"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={14} color="#EF4444" />
                <span>{[user?.city, user?.state].filter(Boolean).join(", ") || "Location not set"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Strength Progress Card - Hides when 100% complete */}
        {profileStrength < 100 && (
          <div style={{
            backgroundColor: "#EFF6FF",
            borderRadius: "20px",
            padding: "18px 24px",
            border: "1px solid #BFDBFE",
            marginBottom: "20px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={16} color="#2563EB" />
                <span style={{ fontSize: "14px", fontWeight: "800", color: "#1E40AF" }}>Profile Strength</span>
              </div>
              <span style={{ fontSize: "13px", fontWeight: "800", color: "#2563EB" }}>{profileStrength}% Complete</span>
            </div>
            <div style={{ height: "8px", backgroundColor: "#DBEAFE", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
              <div style={{ height: "100%", width: `${profileStrength}%`, backgroundColor: "#2563EB", borderRadius: "4px" }} />
            </div>
            <p style={{ fontSize: "12px", color: "#1E3A8A", margin: 0 }}>
              Complete your profile details to improve trust with space owners and advertisers.
            </p>
          </div>
        )}

        {successMsg && (
          <div style={{ padding: "14px 18px", borderRadius: "14px", backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#059669", fontSize: "13px", fontWeight: "700", marginBottom: "20px" }}>
            {successMsg}
          </div>
        )}

        {/* Edit Profile Form Modal / Section */}
        {isEditing && (
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "28px", border: "1px solid #E2E8F0", marginBottom: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", marginBottom: "18px" }}>
              Edit Personal Information
            </h3>

            {error && (
              <div style={{ padding: "12px 16px", borderRadius: "12px", backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2", color: "#EF4444", fontSize: "13px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* DP Upload File Selector */}
              <div style={{ backgroundColor: "#F8FAFC", padding: "16px", borderRadius: "16px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "16px" }}>
                <img
                  src={getAvatarUrl(profileImage)}
                  alt="DP Preview"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                  style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "2px solid #2563EB" }}
                />
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>
                    Profile Avatar / Photo
                  </label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <label style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "7px 14px",
                      borderRadius: "10px",
                      backgroundColor: "#0F172A",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}>
                      <Camera size={14} /> Upload Image File
                      <input type="file" accept="image/*" onChange={handleImageFileChange} style={{ display: "none" }} />
                    </label>
                    <span style={{ fontSize: "12px", color: "#94A3B8" }}>or enter Image URL below</span>
                  </div>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    className="input-field"
                    style={{ marginTop: "8px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>First Name *</label>
                  <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>Last Name *</label>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>Mobile Phone Number</label>
                <input type="tel" maxLength={10} value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ""))} className="input-field" />
              </div>

              {/* Location Section */}
              <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Location Details</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button type="button" onClick={handleDetectGPS} disabled={locating} className="btn btn-secondary btn-sm" style={{ padding: "4px 10px", fontSize: "11px" }}>
                      <Navigation size={12} /> Detect GPS
                    </button>
                    <button type="button" onClick={() => handleAnalyseCoords(city, state)} disabled={locating} className="btn btn-secondary btn-sm" style={{ padding: "4px 10px", fontSize: "11px" }}>
                      <Compass size={12} /> Analyse Coords
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                  <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} onBlur={() => handleAnalyseCoords(city, state, true)} className="input-field" />
                  <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} onBlur={() => handleAnalyseCoords(city, state, true)} className="input-field" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="input-field" />
                  <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="input-field" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>Bio / Personal Statement</label>
                <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none", resize: "none" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary btn-md">Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-blue btn-md">{loading ? "Saving Profile..." : "Save Profile Changes"}</button>
              </div>
            </form>
          </div>
        )}

        {/* SETTINGS CATEGORY SECTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "36px" }}>
          {/* SECTION: ACCOUNT & SECURITY */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "800", color: "#94A3B8", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "4px" }}>
              Account & Security
            </h4>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div
                onClick={() => setPasswordModalOpen(true)}
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Lock size={18} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Password & Security</h5>
                    <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Change account password and update security settings</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#94A3B8" />
              </div>

              <div
                onClick={handleSwitchToSeller}
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#F3E8FF", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                      {hasSellerRole ? "Switch to Seller Mode" : "Become a Seller"}
                    </h5>
                    <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>
                      {hasSellerRole ? "Access your Merchant Seller Dashboard" : "List your ad spaces to earn revenue"}
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "800", color: hasSellerRole ? "#7C3AED" : "#059669", backgroundColor: hasSellerRole ? "#F3E8FF" : "#ECFDF5", padding: "4px 10px", borderRadius: "9999px" }}>
                  {hasSellerRole ? "Seller Active" : "New"}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION: PREFERENCES & PRIVACY */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "800", color: "#94A3B8", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "4px" }}>
              Preferences & Privacy
            </h4>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div
                onClick={() => setNotifModalOpen(true)}
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#F8FAFC", color: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Bell size={18} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Notification Settings</h5>
                    <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Push alerts, email confirmations & booking reminders</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#94A3B8" />
              </div>

              <div
                onClick={() => setPrivacyModalOpen(true)}
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#E0F2FE", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Privacy & Data Controls</h5>
                    <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Public profile visibility and contact details privacy</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#94A3B8" />
              </div>
            </div>
          </div>

          {/* SECTION: BOOKINGS & FAVORITES */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "800", color: "#94A3B8", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "4px" }}>
              Bookings & Saved Spaces
            </h4>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div
                onClick={() => navigate("/buyer/bookings")}
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>My Bookings & Invoices</h5>
                    <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>View past & active billboard and digital ad space bookings</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#94A3B8" />
              </div>

              <div
                onClick={() => alert("Saved Ad Spaces feature coming soon!")}
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#FCE7F3", color: "#DB2777", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Heart size={18} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Saved Ad Spaces</h5>
                    <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Bookmarked hoardings and digital screens</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#94A3B8" />
              </div>
            </div>
          </div>

          {/* SECTION: DANGER ZONE */}
          <div>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div
                onClick={() => {
                  if (window.confirm("Are you sure you want to log out of BrandHive?")) {
                    logout();
                    navigate("/");
                  }
                }}
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#FEF2F2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <LogOut size={18} />
                  </div>
                  <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#EF4444", margin: 0 }}>Log Out Account</h5>
                </div>
              </div>

              <div
                onClick={() => setDeleteModalOpen(true)}
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#FEF2F2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 size={18} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#EF4444", margin: 0 }}>Delete Account</h5>
                    <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Permanently remove your profile and data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* PASSWORD CHANGE MODAL */}
      <Modal isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} maxWidth="480px">
        <div style={{ padding: "4px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", marginBottom: "4px" }}>
            Change Password
          </h3>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>
            Update your account password to maintain maximum security.
          </p>

          {passwordMsg.text && (
            <div style={{ padding: "10px 14px", borderRadius: "10px", backgroundColor: passwordMsg.type === "success" ? "#ECFDF5" : "#FEF2F2", color: passwordMsg.type === "success" ? "#059669" : "#EF4444", fontSize: "13px", fontWeight: "700", marginBottom: "14px" }}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>Current Password</label>
              <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>New Password (min 6 chars)</label>
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>Confirm New Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
              <button type="button" onClick={() => setPasswordModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-blue btn-sm">{loading ? "Updating..." : "Update Password"}</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* NOTIFICATION PREFERENCES MODAL */}
      <Modal isOpen={notifModalOpen} onClose={() => setNotifModalOpen(false)} maxWidth="520px">
        <div style={{ padding: "4px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", marginBottom: "4px" }}>
            Notification Preferences
          </h3>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>
            Configure how you receive alert updates and notifications.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", display: "block" }}>Push Notifications</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Receive real-time push alerts</span>
              </div>
              <input type="checkbox" checked={notifPrefs.pushNotifications} onChange={(e) => handleToggleNotif("pushNotifications", e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", display: "block" }}>Email Notifications</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Booking updates & receipts by email</span>
              </div>
              <input type="checkbox" checked={notifPrefs.emailNotifications} onChange={(e) => handleToggleNotif("emailNotifications", e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", display: "block" }}>Booking Alerts</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Alerts for ad campaign approvals & dates</span>
              </div>
              <input type="checkbox" checked={notifPrefs.bookingUpdates} onChange={(e) => handleToggleNotif("bookingUpdates", e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
            <button onClick={() => setNotifModalOpen(false)} className="btn btn-blue btn-sm">Done</button>
          </div>
        </div>
      </Modal>

      {/* PRIVACY SETTINGS MODAL */}
      <Modal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} maxWidth="520px">
        <div style={{ padding: "4px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", marginBottom: "4px" }}>
            Privacy Controls
          </h3>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>
            Manage public visibility of your profile and contact options.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", display: "block" }}>Public Profile Visibility</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Allow other users to discover your profile</span>
              </div>
              <input type="checkbox" checked={privacySettings.profileVisible} onChange={(e) => handleTogglePrivacy("profileVisible", e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", display: "block" }}>Display City & State</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Show your general location on listings</span>
              </div>
              <input type="checkbox" checked={privacySettings.showLocation} onChange={(e) => handleTogglePrivacy("showLocation", e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
            <button onClick={() => setPrivacyModalOpen(false)} className="btn btn-blue btn-sm">Done</button>
          </div>
        </div>
      </Modal>

      {/* DELETE ACCOUNT MODAL */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="460px">
        <div style={{ padding: "4px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#EF4444", marginBottom: "8px" }}>
            Delete BrandHive Account
          </h3>
          <p style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.5", marginBottom: "20px" }}>
            Are you sure you want to permanently delete your BrandHive account? All saved listings, personal preferences, and account history will be permanently deleted.
          </p>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button onClick={() => setDeleteModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
            <button onClick={handleDeleteAccountSubmit} disabled={loading} className="btn btn-sm" style={{ backgroundColor: "#EF4444", color: "#FFF", border: "none" }}>
              {loading ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default BuyerProfilePage;
