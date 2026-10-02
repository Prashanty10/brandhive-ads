import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/seller/Sidebar";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../auth/AuthContext";
import {
  profileSetupApi,
  updateSellerProfileApi,
  changePasswordApi,
  updateNotificationPreferencesApi,
  updatePrivacySettingsApi,
  deleteAccountApi,
} from "../../api/authApi";
import { getHomeAdSpacesApi } from "../../api/adspaceApi";
import { getSellerBookingsApi } from "../../api/bookingApi";
import {
  User,
  RefreshCw,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Building2,
  CheckCircle2,
  Briefcase,
  CreditCard,
  Bell,
  HelpCircle,
  FileText,
  LogOut,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  Camera,
  Lock,
  Shield,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";

const getAvatarUrl = (img) => {
  if (!img || typeof img !== "string") return DEFAULT_AVATAR;
  const trimmed = img.trim();
  if (!trimmed || trimmed.startsWith("file://")) return DEFAULT_AVATAR;
  return trimmed;
};

const SellerProfilePage = () => {
  const { user, switchRole, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Metrics Stats
  const [totalSpaces, setTotalSpaces] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState("");
  const [infoModalContent, setInfoModalContent] = useState("");
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // Edit Form State
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [mobileNumber, setMobileNumber] = useState(
    user?.mobileNumber || user?.mobile || ""
  );
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [companyName, setCompanyName] = useState(
    user?.sellerProfile?.businessName || user?.companyName || ""
  );
  const [businessType, setBusinessType] = useState(
    user?.sellerProfile?.businessType || "Media Owner"
  );
  const [businessDescription, setBusinessDescription] = useState(
    user?.sellerProfile?.businessDescription || ""
  );
  const [businessAddress, setBusinessAddress] = useState(
    user?.sellerProfile?.businessAddress || ""
  );
  const [gstin, setGstin] = useState(
    user?.sellerProfile?.gstNumber || user?.gstin || ""
  );
  const [panNumber, setPanNumber] = useState(
    user?.sellerProfile?.panNumber || ""
  );
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
    sellerAlerts: true,
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    showLocation: true,
  });

  const [updating, setUpdating] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setMobileNumber(user.mobileNumber || user.mobile || "");
      setCity(user.city || "");
      setState(user.state || "");
      setCompanyName(user.sellerProfile?.businessName || user.companyName || "");
      setBusinessType(user.sellerProfile?.businessType || "Media Owner");
      setBusinessDescription(user.sellerProfile?.businessDescription || "");
      setBusinessAddress(user.sellerProfile?.businessAddress || "");
      setGstin(user.sellerProfile?.gstNumber || user.gstin || "");
      setPanNumber(user.sellerProfile?.panNumber || "");
      setProfileImage(user.profileImage || "");

      if (user.notificationPreferences) {
        setNotifPrefs((prev) => ({ ...prev, ...user.notificationPreferences }));
      }
      if (user.privacySettings) {
        setPrivacySettings((prev) => ({ ...prev, ...user.privacySettings }));
      }
    }
  }, [user]);

  // Fetch Seller Performance Metrics
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const [spacesRes, bookingsRes] = await Promise.allSettled([
          getHomeAdSpacesApi(),
          getSellerBookingsApi(),
        ]);

        if (spacesRes.status === "fulfilled" && spacesRes.value?.data) {
          const arr = Array.isArray(spacesRes.value.data)
            ? spacesRes.value.data
            : [];
          setTotalSpaces(arr.length);
        }

        if (bookingsRes.status === "fulfilled" && bookingsRes.value?.data) {
          const bookings = Array.isArray(bookingsRes.value.data)
            ? bookingsRes.value.data
            : [];
          setActiveBookings(
            bookings.filter(
              (b) => b.status === "confirmed" || b.status === "pending"
            ).length
          );
          const earnings = bookings.reduce(
            (sum, b) => sum + (Number(b.totalAmount || b.price) || 0),
            0
          );
          setTotalEarnings(earnings);
        }
      } catch (err) {
        console.log("Seller profile stats error:", err);
      }
    };
    fetchSellerData();
  }, []);

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

  // Calculate Seller Profile Completion Strength
  const calculateSellerStrength = () => {
    const fields = [
      Boolean(user?.firstName),
      Boolean(user?.lastName),
      Boolean(user?.email),
      Boolean(user?.mobileNumber || user?.mobile),
      Boolean(user?.city),
      Boolean(user?.state),
      Boolean(user?.profileImage),
      Boolean(user?.sellerProfile?.businessName || companyName),
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const sellerStrength = calculateSellerStrength();

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setEditMessage("");

    try {
      await profileSetupApi({
        firstName,
        lastName,
        mobileNumber,
        city,
        state,
        companyName,
        gstin,
        profileImage,
        sellerProfile: {
          businessName: companyName,
          businessType,
          businessDescription,
          businessAddress,
          businessCity: city,
          businessState: state,
          gstNumber: gstin,
          panNumber,
        },
      });
      await updateSellerProfileApi({
        sellerProfile: {
          businessName: companyName,
          businessType,
          businessDescription,
          businessAddress,
          businessCity: city,
          businessState: state,
          gstNumber: gstin,
          panNumber,
        },
      });
      await refreshUser();
      setEditMessage("Business Profile updated successfully!");
      setTimeout(() => {
        setEditModalOpen(false);
        setEditMessage("");
      }, 1000);
    } catch (err) {
      setEditMessage(err?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (newPassword.length < 6) {
      setPasswordMsg({
        type: "error",
        text: "New password must be at least 6 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      setUpdating(true);
      await changePasswordApi(currentPassword, newPassword);
      setPasswordMsg({ type: "success", text: "Password updated successfully!" });
      setTimeout(() => {
        setPasswordModalOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordMsg({ type: "", text: "" });
      }, 1200);
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err?.message || "Failed to change password.",
      });
    } finally {
      setUpdating(false);
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

  const handleSwitchToBuyer = async () => {
    try {
      await switchRole("buyer");
      navigate("/buyer/home");
    } catch (e) {
      alert("Failed to switch to buyer mode.");
    }
  };

  const handleDeleteAccountSubmit = async () => {
    try {
      setUpdating(true);
      await deleteAccountApi();
      await logout();
      navigate("/");
    } catch (e) {
      alert(e?.message || "Failed to delete seller account.");
    } finally {
      setUpdating(false);
    }
  };

  const openInfoModal = (title, content) => {
    setInfoModalTitle(title);
    setInfoModalContent(content);
    setInfoModalOpen(true);
  };

  const name = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Seller Profile";
  const locationLabel =
    [user?.city, user?.state].filter(Boolean).join(", ") ||
    "Location not specified";

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }} className="seller-layout">
      <Sidebar />

      <main className="seller-main-content">
        <div style={{ maxWidth: "920px", margin: "0 auto" }}>
          {/* Page Title */}
          <div style={{ marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Merchant Workspace
            </span>
            <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0F172A", letterSpacing: "-0.5px", marginTop: "2px" }}>
              Seller Profile
            </h1>
          </div>

          {/* Hero Profile Header Card */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
            marginBottom: "24px",
          }}>
            {/* Cover Gradient */}
            <div style={{ height: "90px", background: "linear-gradient(90deg, #581C87 0%, #7C3AED 50%, #9333EA 100%)" }} />

            <div style={{ padding: "0 28px 24px 28px", marginTop: "-44px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "16px" }}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={getAvatarUrl(user?.profileImage)}
                      alt="Seller Logo"
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
                      backgroundColor: "#059669",
                      color: "#FFFFFF",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #FFFFFF",
                    }}>
                      <ShieldCheck size={13} />
                    </div>
                  </div>

                  <div style={{ paddingBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0F172A", letterSpacing: "-0.3px" }}>
                        {companyName || name}
                      </h2>
                      {/* Seller Account Chip Badge directly beside name */}
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        color: "#7C3AED",
                        backgroundColor: "#F3E8FF",
                        border: "1px solid #E9D5FF",
                        padding: "3px 10px",
                        borderRadius: "9999px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}>
                        <Briefcase size={12} /> Seller Account
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#64748B", fontWeight: "500", marginTop: "2px" }}>
                      Owner: {name}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(true)}
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
                    }}
                  >
                    <Edit size={14} />
                    Edit Business Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleSwitchToBuyer}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "9px 18px",
                      borderRadius: "12px",
                      backgroundColor: "#F3E8FF",
                      color: "#7C3AED",
                      fontSize: "13px",
                      fontWeight: "700",
                      border: "1px solid #E9D5FF",
                      cursor: "pointer",
                    }}
                  >
                    <RefreshCw size={14} />
                    Switch to Buyer Mode
                  </button>
                </div>
              </div>

              {/* Contact Pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "#475569", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Mail size={14} color="#3B82F6" />
                  <span>{user?.email || "Email not specified"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Phone size={14} color="#10B981" />
                  <span>{user?.mobileNumber || user?.mobile || "Phone not specified"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={14} color="#EF4444" />
                  <span>{locationLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion Strength Card - Hides when 100% complete */}
          {sellerStrength < 100 && (
            <div style={{
              backgroundColor: "#F3E8FF",
              borderRadius: "20px",
              padding: "18px 24px",
              border: "1px solid #E9D5FF",
              marginBottom: "24px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkles size={16} color="#7C3AED" />
                  <span style={{ fontSize: "14px", fontWeight: "800", color: "#581C87" }}>Seller Profile Strength</span>
                </div>
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#7C3AED" }}>{sellerStrength}% Complete</span>
              </div>
              <div style={{ height: "8px", backgroundColor: "#E9D5FF", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
                <div style={{ height: "100%", width: `${sellerStrength}%`, backgroundColor: "#7C3AED", borderRadius: "4px" }} />
              </div>
              <p style={{ fontSize: "12px", color: "#581C87", margin: 0 }}>
                Complete your seller profile & business details to build trust with media buyers.
              </p>
            </div>
          )}

          {/* Quick Performance Metrics Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#2563EB", marginBottom: "8px" }}>
                <Building2 size={20} />
                <span style={{ fontSize: "13px", fontWeight: "700" }}>Total Listed Spaces</span>
              </div>
              <p style={{ fontSize: "28px", fontWeight: "900", color: "#0F172A", margin: 0 }}>{totalSpaces}</p>
              <span style={{ fontSize: "12px", color: "#64748B" }}>Active in Inventory</span>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#059669", marginBottom: "8px" }}>
                <TrendingUp size={20} />
                <span style={{ fontSize: "13px", fontWeight: "700" }}>Active Bookings</span>
              </div>
              <p style={{ fontSize: "28px", fontWeight: "900", color: "#0F172A", margin: 0 }}>{activeBookings}</p>
              <span style={{ fontSize: "12px", color: "#64748B" }}>Confirmed / Pending</span>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#7C3AED", marginBottom: "8px" }}>
                <DollarSign size={20} />
                <span style={{ fontSize: "13px", fontWeight: "700" }}>Est. Payout Earnings</span>
              </div>
              <p style={{ fontSize: "28px", fontWeight: "900", color: "#0F172A", margin: 0 }}>₹{totalEarnings.toLocaleString("en-IN")}</p>
              <span style={{ fontSize: "12px", color: "#64748B" }}>Processed Payouts</span>
            </div>
          </div>

          {/* BUSINESS & SETTINGS SECTIONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "36px" }}>
            {/* SECTION 1: BUSINESS & INVENTORY */}
            <div>
              <h4 style={{ fontSize: "11px", fontWeight: "800", color: "#94A3B8", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "4px" }}>
                Business & Inventory Management
              </h4>

              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
                <div
                  onClick={() => setEditModalOpen(true)}
                  style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Business Information</h5>
                      <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Company details, registered address, GSTIN & PAN</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#2563EB" }}>Edit Details</span>
                </div>

                <div
                  onClick={() => openInfoModal("KYC & Seller Verification", "Status: VERIFIED\nDocument Type: Business License & PAN\nCompliance: Active")}
                  style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>KYC & Seller Verification</h5>
                      <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Identity document and business license verification</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#059669", backgroundColor: "#ECFDF5", padding: "4px 10px", borderRadius: "9999px" }}>
                    Verified
                  </span>
                </div>

                <div
                  onClick={() => openInfoModal("Bank Account & Payout Settlement", "Method: Direct Bank Transfer (NEFT/RTGS)\nBank: HDFC Bank\nStatus: Payout Active")}
                  style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Bank Account & Payout Settlement</h5>
                      <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Manage bank accounts & withdrawal settings</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#2563EB" }}>Manage</span>
                </div>
              </div>
            </div>

            {/* SECTION 2: SECURITY & PREFERENCES */}
            <div>
              <h4 style={{ fontSize: "11px", fontWeight: "800", color: "#94A3B8", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "4px" }}>
                Security & Notifications
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
                      <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Update password and security credentials</p>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#94A3B8" />
                </div>

                <div
                  onClick={() => setNotifModalOpen(true)}
                  style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#F8FAFC", color: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bell size={18} />
                    </div>
                    <div>
                      <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Notification Preferences</h5>
                      <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Booking alerts & payout SMS notifications</p>
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
                      <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Privacy & Data</h5>
                      <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Manage seller contact visibility on listings</p>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#94A3B8" />
                </div>
              </div>
            </div>

            {/* SECTION 3: DANGER ZONE */}
            <div>
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
                <div
                  onClick={() => {
                    if (window.confirm("Are you sure you want to sign out of BrandHive Seller Portal?")) {
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
                    <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#EF4444", margin: 0 }}>Log Out Seller Account</h5>
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
                      <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#EF4444", margin: 0 }}>Delete Seller Account</h5>
                      <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Permanently remove your listings & account</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* EDIT BUSINESS PROFILE MODAL */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="600px">
        <div style={{ padding: "4px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "900", color: "#0F172A", marginBottom: "4px" }}>
            Edit Business Profile
          </h3>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "18px" }}>
            Update your seller name, company info, and business credentials.
          </p>

          {editMessage && (
            <div style={{ padding: "12px", borderRadius: "10px", backgroundColor: editMessage.includes("success") ? "#ECFDF5" : "#FEF2F2", color: editMessage.includes("success") ? "#059669" : "#EF4444", fontSize: "13px", fontWeight: "700", marginBottom: "16px" }}>
              {editMessage}
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* DP / Logo File Selector */}
            <div style={{ backgroundColor: "#F8FAFC", padding: "14px", borderRadius: "14px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "14px" }}>
              <img
                src={getAvatarUrl(profileImage)}
                alt="Logo Preview"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
                style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "2px solid #7C3AED" }}
              />
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>Seller Avatar / Logo</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <label style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    backgroundColor: "#0F172A",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}>
                    <Camera size={14} /> Upload Image
                    <input type="file" accept="image/*" onChange={handleImageFileChange} style={{ display: "none" }} />
                  </label>
                  <span style={{ fontSize: "11px", color: "#94A3B8" }}>or paste Image URL below</span>
                </div>
                <input
                  type="text"
                  placeholder="https://..."
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="input-field"
                  style={{ marginTop: "6px" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>First Name *</label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>Last Name *</label>
                <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>Company / Brand Name</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Apex Outdoor Ads" className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>Business Type</label>
                <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="input-field">
                  <option value="Media Owner">Media Owner</option>
                  <option value="Agency">Agency</option>
                  <option value="Individual Owner">Individual Owner</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>Mobile Phone Number</label>
              <input type="tel" maxLength={10} value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="input-field" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>State</label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="input-field" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>GSTIN (Tax ID)</label>
                <input type="text" value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="e.g. 27ABCDE1234F1Z5" className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px", display: "block" }}>PAN Number</label>
                <input type="text" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} placeholder="e.g. ABCDE1234F" className="input-field" />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
              <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-secondary btn-md">Cancel</button>
              <button type="submit" disabled={updating} className="btn btn-blue btn-md">{updating ? "Saving..." : "Save Business Profile"}</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* PASSWORD CHANGE MODAL */}
      <Modal isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} maxWidth="480px">
        <div style={{ padding: "4px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", marginBottom: "4px" }}>
            Change Password
          </h3>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>
            Update your seller account password to maintain security.
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
              <button type="submit" disabled={updating} className="btn btn-blue btn-sm">{updating ? "Updating..." : "Update Password"}</button>
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
            Manage booking alerts & payout notifications.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", display: "block" }}>Push Notifications</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Real-time push alerts on mobile/web</span>
              </div>
              <input type="checkbox" checked={notifPrefs.pushNotifications} onChange={(e) => handleToggleNotif("pushNotifications", e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", display: "block" }}>Seller Booking Alerts</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Alerts for new buyer requests & inquiries</span>
              </div>
              <input type="checkbox" checked={notifPrefs.sellerAlerts} onChange={(e) => handleToggleNotif("sellerAlerts", e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", display: "block" }}>Payout Email Statements</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Weekly payout statements by email</span>
              </div>
              <input type="checkbox" checked={notifPrefs.emailNotifications} onChange={(e) => handleToggleNotif("emailNotifications", e.target.checked)} style={{ width: "18px", height: "18px" }} />
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
            Privacy & Contact Controls
          </h3>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>
            Control visibility of seller details on public ad listings.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", display: "block" }}>Public Merchant Listing</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Allow advertisers to view your business profile</span>
              </div>
              <input type="checkbox" checked={privacySettings.profileVisible} onChange={(e) => handleTogglePrivacy("profileVisible", e.target.checked)} style={{ width: "18px", height: "18px" }} />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", display: "block" }}>Show Location Details</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Display city & state on inventory cards</span>
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
            Delete Seller Account
          </h3>
          <p style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.5", marginBottom: "20px" }}>
            Are you sure you want to permanently delete your Seller Account? All listed advertisement spaces, booking history, and merchant credentials will be permanently removed.
          </p>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button onClick={() => setDeleteModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
            <button onClick={handleDeleteAccountSubmit} disabled={updating} className="btn btn-sm" style={{ backgroundColor: "#EF4444", color: "#FFF", border: "none" }}>
              {updating ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* INFO MODAL */}
      <Modal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} maxWidth="480px">
        <div style={{ padding: "4px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", marginBottom: "12px" }}>
            {infoModalTitle}
          </h3>
          <div style={{ whiteSpace: "pre-line", fontSize: "14px", color: "#475569", lineHeight: "1.6", backgroundColor: "#F8FAFC", padding: "16px", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "20px" }}>
            {infoModalContent}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setInfoModalOpen(false)} className="btn btn-blue btn-sm">Close</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SellerProfilePage;
