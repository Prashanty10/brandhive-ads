import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../../../Theme/colors";
import { userInfo } from "../../Buyer/Api/userApi";
import { getMyAdvertisementsApi, getSellerBookingsApi } from "../../Buyer/Api/adspaceApi";
import SkeletonCard from "../components/SkeletonCard";

const CATEGORY_GROUPS = [
  { id: "all", label: "All Mediums" },
  { id: "outdoor", label: "Outdoor" },
  { id: "transit", label: "Transit" },
  { id: "commercial", label: "Commercial" },
  { id: "mobile", label: "Mobile" },
];

const OFFLINE_AD_CATEGORIES = [
  { id: 1, group: "outdoor", categoryName: "hoarding", title: "Hoarding", subtitle: "Traditional Outdoor Unipole & Billboard", icon: "easel-outline", tag: "Outdoor", color: "#2563EB" },
  { id: 2, group: "outdoor", categoryName: "digital_billboard", title: "Digital Billboard", subtitle: "High-Def 4K Outdoor LED Screens", icon: "tv-outline", tag: "Digital", color: "#7C3AED" },
  { id: 3, group: "outdoor", categoryName: "led_screen", title: "LED Screen", subtitle: "Commercial & Retail Standee Displays", icon: "desktop-outline", tag: "Retail", color: "#DB2777" },
  { id: 4, group: "transit", categoryName: "bus_advertisement", title: "Bus Advertisement", subtitle: "City Public Transit Full Body Wraps", icon: "bus-outline", tag: "Transit", color: "#D97706" },
  { id: 5, group: "outdoor", categoryName: "bus_shelter_advertisement", title: "Bus Shelter Banners", subtitle: "Lit Commuter Panels & Shelter Media", icon: "business-outline", tag: "Street", color: "#059669" },
  { id: 6, group: "transit", categoryName: "auto_rickshaw_advertisement", title: "Auto Rickshaw Ads", subtitle: "Mobile Hood Covers & Backseat Branding", icon: "car-outline", tag: "Mobile", color: "#0891B2" },
  { id: 7, group: "transit", categoryName: "taxi_advertisement", title: "Taxi & Cab Branding", subtitle: "Cab Carrier & Glass Media Wraps", icon: "car-sport-outline", tag: "Mobile", color: "#4F46E5" },
  { id: 8, group: "mobile", categoryName: "van_advertisement", title: "Display Vans", subtitle: "Mobile LED Display Van with Audio", icon: "bus-outline", tag: "Event", color: "#EA580C" },
  { id: 9, group: "mobile", categoryName: "truck_advertisement", title: "Truck Highway Wraps", subtitle: "Intercity Highway Cargo Container Body", icon: "car-outline", tag: "Highway", color: "#475569" },
  { id: 10, group: "transit", categoryName: "metro_advertisement", title: "Metro Transit Ads", subtitle: "Train Exterior Wraps & Station Media", icon: "subway-outline", tag: "Transit", color: "#2563EB" },
  { id: 11, group: "transit", categoryName: "local_train_advertisement", title: "Local Train Banners", subtitle: "Overhead Posters & Coach Interior Media", icon: "train-outline", tag: "Mass Transit", color: "#059669" },
  { id: 12, group: "commercial", categoryName: "railway_station_advertisement", title: "Railway Station Media", subtitle: "FOB Bridge Banners & Platform Screens", icon: "location-outline", tag: "Station", color: "#7C3AED" },
  { id: 13, group: "commercial", categoryName: "airport_advertisement", title: "Airport Terminal Ads", subtitle: "Terminal Screens & Baggage Trolleys", icon: "airplane-outline", tag: "Premium", color: "#DB2777" },
  { id: 14, group: "commercial", categoryName: "mall_advertisement", title: "Mall & Atrium Banners", subtitle: "Drop Banners, Escalators & Digital Displays", icon: "storefront-outline", tag: "High Traffic", color: "#D97706" },
];

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";

const DashboardScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeGroup, setActiveGroup] = useState("all");

  const [stats, setStats] = useState({
    totalAdSpaces: 0,
    activeListings: 0,
    pendingBookings: 0,
    totalBookings: 0,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchDashboardData = async (isRef = false) => {
    if (isRef) setRefreshing(true);
    else setLoading(true);

    try {
      // 1. Fetch user info
      const uRes = await userInfo();
      if (uRes?.user) setUser(uRes.user);

      // 2. Fetch seller ads count & status
      const adsRes = await getMyAdvertisementsApi();
      let totalAds = 0;
      let activeAds = 0;
      if (adsRes?.success && Array.isArray(adsRes.data)) {
        totalAds = adsRes.data.length;
        activeAds = adsRes.data.filter((a) => (a.status || "active").toLowerCase() === "active").length;
      }

      // 3. Fetch seller bookings count
      const bookRes = await getSellerBookingsApi();
      let pendingB = 0;
      let totalB = 0;
      if (bookRes?.success && Array.isArray(bookRes.data)) {
        totalB = bookRes.data.length;
        pendingB = bookRes.data.filter((b) => (b.status || "pending").toLowerCase() === "pending").length;
      }

      setStats({
        totalAdSpaces: totalAds,
        activeListings: activeAds,
        pendingBookings: pendingB,
        totalBookings: totalB,
      });
    } catch (e) {
      console.log("Error fetching seller dashboard data:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const calculateCompletion = () => {
    if (!user) return 0;
    const fields = [
      Boolean(user.firstName),
      Boolean(user.lastName),
      Boolean(user.email),
      Boolean(user.mobileNumber || user.mobile),
      Boolean(user.city),
      Boolean(user.state),
      Boolean(user.profileImage),
      Boolean(user.bio),
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completionPercent = calculateCompletion();

  const handleCategoryPress = (categoryName) => {
    router.push({ pathname: "/Seller/CreateAdvertisement", params: { categoryName } });
  };

  const sellerName = user?.firstName
    ? `${user.firstName}${user?.lastName ? ` ${user.lastName}` : ""}`.trim()
    : "Seller";

  const sellerAvatar = user?.profileImage || DEFAULT_AVATAR;

  const filteredCategories = OFFLINE_AD_CATEGORIES.filter(
    (c) => activeGroup === "all" || c.group === activeGroup
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greetingText}>
            {getGreeting()}, {sellerName} 
          </Text>
          <Text style={styles.subtitleText}>
            Manage your advertising spaces and campaigns
          </Text>
        </View>

        <TouchableOpacity
          style={styles.avatarBtn}
          activeOpacity={0.8}
          onPress={() => router.push("/Seller/Screens/SellerProfileScreen")}
        >
          <Image source={{ uri: sellerAvatar }} style={styles.avatarImg} />
          <View style={styles.onlineBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchDashboardData(true)}
            tintColor={colors.primary}
          />
        }
      >
        {loading && !refreshing ? (
          <SkeletonCard type="dashboard" />
        ) : (
          <>
            {/* ── Profile Completion Card ── */}
            {completionPercent < 100 && (
              <View style={styles.completionCard}>
                <View style={styles.completionHeaderRow}>
                  <View style={styles.completionTitleCol}>
                    <Text style={styles.completionLabel}>Profile Strength</Text>
                    <Text style={styles.completionSubtext}>Complete your profile to improve buyer trust</Text>
                  </View>
                  <View style={styles.completionPercentBadge}>
                    <Text style={styles.completionPercentText}>{completionPercent}%</Text>
                  </View>
                </View>

                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${completionPercent}%` }]} />
                </View>

                <TouchableOpacity
                  style={styles.completeProfileBtn}
                  activeOpacity={0.85}
                  onPress={() => router.push("/Buyer/components/Profile/EditProfileScreen")}
                >
                  <Ionicons name="sparkles-outline" size={15} color={colors.white} />
                  <Text style={styles.completeProfileBtnText}>Complete Profile →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── Business Overview Stats Grid ── */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Business Overview</Text>
              <View style={styles.statsGrid}>

                <View style={styles.statCard}>
                  <View style={[styles.statIconBadge, { backgroundColor: "#EFF6FF" }]}>
                    <Ionicons name="easel-outline" size={18} color="#2563EB" />
                  </View>
                  <Text style={styles.statCount}>{stats.totalAdSpaces}</Text>
                  <Text style={styles.statLabel}>Total Ad Spaces</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={[styles.statIconBadge, { backgroundColor: "#ECFDF5" }]}>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#059669" />
                  </View>
                  <Text style={styles.statCount}>{stats.activeListings}</Text>
                  <Text style={styles.statLabel}>Active Listings</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={[styles.statIconBadge, { backgroundColor: "#FFF7ED" }]}>
                    <Ionicons name="time-outline" size={18} color="#D97706" />
                  </View>
                  <Text style={styles.statCount}>{stats.pendingBookings}</Text>
                  <Text style={styles.statLabel}>Pending Requests</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={[styles.statIconBadge, { backgroundColor: "#F3E8FF" }]}>
                    <Ionicons name="calendar-outline" size={18} color="#7C3AED" />
                  </View>
                  <Text style={styles.statCount}>{stats.totalBookings}</Text>
                  <Text style={styles.statLabel}>Total Bookings</Text>
                </View>

              </View>
            </View>

            {/* ── Quick Actions ── */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>

                <TouchableOpacity
                  style={styles.primaryActionCard}
                  activeOpacity={0.88}
                  onPress={() => router.push({ pathname: "/Seller/CreateAdvertisement" })}
                >
                  <View style={styles.primaryActionIconBox}>
                    <Ionicons name="add" size={22} color={colors.white} />
                  </View>
                  <View style={styles.primaryActionTextCol}>
                    <Text style={styles.primaryActionTitle}>+ Add Advertisement Space</Text>
                    <Text style={styles.primaryActionSub}>List new hoarding, billboard or transit space</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.white} />
                </TouchableOpacity>

                <View style={styles.secondaryActionsRow}>
                  <TouchableOpacity
                    style={styles.secondaryActionBtn}
                    activeOpacity={0.8}
                    onPress={() => router.push("/Seller/Screens/AdvertisementsScreen")}
                  >
                    <Ionicons name="megaphone-outline" size={18} color={colors.primary} />
                    <Text style={styles.secondaryActionText}>My Ads</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryActionBtn}
                    activeOpacity={0.8}
                    onPress={() => router.push("/Seller/Screens/BookingsScreen")}
                  >
                    <Ionicons name="calendar-outline" size={18} color="#059669" />
                    <Text style={styles.secondaryActionText}>Bookings</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryActionBtn}
                    activeOpacity={0.8}
                    onPress={() => router.push("/Seller/Screens/SellerProfileScreen")}
                  >
                    <Ionicons name="person-outline" size={18} color="#7C3AED" />
                    <Text style={styles.secondaryActionText}>Profile</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>

            {/* ── Category Marketplace Section ── */}
            <View style={styles.categorySectionHeader}>
              <Text style={styles.sectionTitle}>List New Ad Space</Text>
              <Text style={styles.sectionSubtitle}>Choose advertising medium to create listing</Text>

              {/* Category Filter Chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipRow}
              >
                {CATEGORY_GROUPS.map((grp) => {
                  const isSel = activeGroup === grp.id;
                  return (
                    <TouchableOpacity
                      key={grp.id}
                      style={[styles.filterChip, isSel && styles.filterChipActive]}
                      onPress={() => setActiveGroup(grp.id)}
                    >
                      <Text style={[styles.filterChipText, isSel && styles.filterChipTextActive]}>
                        {grp.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.categoriesGrid}>
              {filteredCategories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.categoryCard}
                  activeOpacity={0.8}
                  onPress={() => handleCategoryPress(item.categoryName)}
                >
                  <View style={[styles.catIconBox, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>

                  <View style={styles.catInfo}>
                    <View style={styles.catTitleRow}>
                      <Text style={styles.catTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={[styles.tagBadge, { backgroundColor: `${item.color}12` }]}>
                        <Text style={[styles.tagBadgeText, { color: item.color }]}>{item.tag}</Text>
                      </View>
                    </View>

                    <Text style={styles.catSubtitle} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>

                  <View style={styles.arrowCircle}>
                    <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : hp("6%"),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
    fontWeight: "400",
  },
  avatarBtn: {
    position: "relative",
  },
  avatarImg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: colors.border,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: hp("15%"),
  },

  // Profile Completion
  completionCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  completionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  completionTitleCol: {
    flex: 1,
  },
  completionLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  completionSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  completionPercentBadge: {
    backgroundColor: colors.neutralLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completionPercentText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.neutralLight,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 14,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.textPrimary,
    borderRadius: 4,
  },
  completeProfileBtn: {
    height: 42,
    backgroundColor: colors.button,
    borderRadius: 21,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  completeProfileBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },

  // Stats
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statCount: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  // Quick Actions
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    gap: 12,
  },
  primaryActionCard: {
    backgroundColor: colors.button,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryActionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryActionTextCol: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.white,
  },
  primaryActionSub: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  secondaryActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryActionBtn: {
    flex: 1,
    height: 46,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  // Categories
  categorySectionHeader: {
    marginBottom: 14,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filterChipRow: {
    gap: 8,
    paddingTop: 12,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: "700",
  },

  categoriesGrid: {
    gap: 10,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  catIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  catInfo: {
    flex: 1,
  },
  catTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  catTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    flexShrink: 1,
  },
  tagBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  catSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
