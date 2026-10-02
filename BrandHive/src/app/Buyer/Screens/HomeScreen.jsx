import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  FlatList,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { userInfo } from "../Api/userApi";
import { getHomeAdSpacesApi } from "../Api/adspaceApi";
import { detectUserLocation } from "../Utils/locationHelper";

import SkeletonSection from "../components/Home/HomeSkeleton";
import AdvertisementSpaceCard from "../components/Home/AdvertisementSpaceCard";
import NearbySpacesSection from "../components/Home/NearbySpacesSection";
import AvailableNowSection from "../components/Home/AvailableNowSection";
import BestValueSection from "../components/Home/BestValueSection";
import NewlyListedSection from "../components/Home/NewlyListedSection";
import HighVisibilitySection from "../components/Home/HighVisibilitySection";
import CategoryCountsSection from "../components/Home/CategoryCountsSection";
import ExploreMapSection from "../components/Home/ExploreMapSection";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";

const HomeScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Home Data State (All from real MongoDB backend)
  const [homeData, setHomeData] = useState({
    featured: [],
    nearby: [],
    availableNow: [],
    bestValue: [],
    newlyListed: [],
    highVisibility: [],
    categories: [],
    recommended: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRadius, setSelectedRadius] = useState(25);
  const [coords, setCoords] = useState(null);
  const [detectedLocationName, setDetectedLocationName] = useState("");
  const [locationAvailable, setLocationAvailable] = useState(true);

  // Detect GPS location on mount
  const handleLocationDetection = async () => {
    const locResult = await detectUserLocation();
    if (locResult.success && locResult.coords) {
      setCoords(locResult.coords);
      setDetectedLocationName(
        `${locResult.city}${locResult.state ? `, ${locResult.state}` : ""}`
      );
      setLocationAvailable(true);
      return locResult;
    } else {
      setLocationAvailable(false);
      return null;
    }
  };

  // Fetch Home AdSpaces from Backend API
  const fetchHomeData = useCallback(
    async (currentRadius = selectedRadius, forcedCoords = coords) => {
      try {
        const userRes = await userInfo().catch(() => null);
        if (userRes?.user) setUser(userRes.user);

        const params = {
          radius: currentRadius,
        };
        if (forcedCoords) {
          params.latitude = forcedCoords.latitude;
          params.longitude = forcedCoords.longitude;
        }

        const dataRes = await getHomeAdSpacesApi(params);
        if (dataRes?.success && dataRes?.data) {
          setHomeData(dataRes.data);
        }
      } catch (error) {
        console.error("Error fetching home ad spaces:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedRadius, coords]
  );

  useEffect(() => {
    (async () => {
      const loc = await handleLocationDetection();
      fetchHomeData(selectedRadius, loc?.coords || null);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHomeData(selectedRadius, coords);
    }, [fetchHomeData, selectedRadius, coords])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const loc = await handleLocationDetection();
    await fetchHomeData(selectedRadius, loc?.coords || null);
  }, [fetchHomeData, selectedRadius]);

  const handleRadiusChange = (newRadius) => {
    setSelectedRadius(newRadius);
    setLoading(true);
    fetchHomeData(newRadius, coords);
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    router.push({
      pathname: "/Buyer/Screens/DiscoverScreen",
      params: { q: searchQuery.trim() },
    });
  };

  const name = user?.firstName || "User";
  const dp = user?.profileImage || DEFAULT_AVATAR;
  const userLocationText =
    detectedLocationName ||
    (user?.city ? `${user.city}${user?.state ? `, ${user.state}` : ""}` : "Spaces Near You");

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <ScrollView
        style={styles.scrollStyle}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* ── 1. Header ── */}
        <View style={styles.headerContainer}>
          <View style={styles.profileContainer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/Buyer/Screens/ProfileScreen")}
              style={styles.avatarWrapper}
            >
              <Image style={styles.avatar} source={{ uri: dp }} />
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text style={styles.welcomeGreeting} numberOfLines={1}>
                Hey, <Text style={styles.welcomeName}>{name}</Text> 👋
              </Text>

              <TouchableOpacity
                style={styles.locationRow}
                activeOpacity={0.7}
                onPress={() => handleLocationDetection()}
              >
                <Ionicons name="location-outline" size={13} color="#EF4444" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {userLocationText}
                </Text>
                <Ionicons name="chevron-down" size={11} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notifBtn}
            activeOpacity={0.8}
            onPress={() => router.push("/Buyer/Screens/ProfileScreen")}
          >
            <Ionicons name="notifications-outline" size={19} color={colors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* ── 2. Search & Filter Bar ── */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchIconBox}>
            <Ionicons name="search-outline" size={16} color={colors.textPrimary} />
          </View>

          <TextInput
            placeholder="Search billboards, cities, types..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />

          <TouchableOpacity
            style={styles.searchFilterBtn}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/Buyer/Screens/DiscoverScreen",
                params: { q: searchQuery },
              })
            }
          >
            <Ionicons name="options-outline" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View style={{ paddingTop: 10 }}>
            <SkeletonSection count={2} />
            <SkeletonSection count={2} />
          </View>
        ) : (
          <>
            {/* ── 3. Featured Real Spaces ── */}
            {homeData.featured && homeData.featured.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeaderFlex}>
                  <Text style={styles.sectionTitle}>Featured Real Spaces</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push("/Buyer/Screens/DiscoverScreen")}
                  >
                    <Text style={styles.seeAllText}>See all</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={homeData.featured}
                  keyExtractor={(item) => item._id || item.id}
                  contentContainerStyle={styles.cardsContainer}
                  renderItem={({ item }) => (
                    <AdvertisementSpaceCard
                      item={item}
                      badgeText="FEATURED"
                      badgeBg="#111827"
                    />
                  )}
                />
              </View>
            ) : null}

            {/* ── 4. Campaign Channels ── */}
            <View style={styles.channelsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Campaign Channels</Text>
                <Text style={styles.sectionSubtitle}>
                  Select a channel to discover spaces
                </Text>
              </View>

              <View style={styles.channelsRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.channelCard,
                    pressed && { opacity: 0.9 },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/Buyer/advertisement/online/OnlineCategoryScreen",
                      params: { type: "online" },
                    })
                  }
                >
                  <View style={[styles.channelIconBox, { backgroundColor: "#EFF6FF" }]}>
                    <Ionicons name="globe-outline" size={22} color="#2563EB" />
                  </View>
                  <Text style={styles.channelTitle}>Online Ads</Text>
                  <Text style={styles.channelSubtitle}>
                    Websites, apps{"\n"}& social banners
                  </Text>
                  <View style={styles.channelArrow}>
                    <Ionicons name="arrow-forward" size={14} color="#2563EB" />
                  </View>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.channelCard,
                    pressed && { opacity: 0.9 },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/Buyer/advertisement/offline/OfflineCategoryScreen",
                      params: { type: "offline" },
                    })
                  }
                >
                  <View style={[styles.channelIconBox, { backgroundColor: "#F3E8FF" }]}>
                    <Ionicons name="storefront-outline" size={22} color="#7C3AED" />
                  </View>
                  <Text style={styles.channelTitle}>Offline Ads</Text>
                  <Text style={styles.channelSubtitle}>
                    Billboards, transit{"\n"}& digital screens
                  </Text>
                  <View style={styles.channelArrow}>
                    <Ionicons name="arrow-forward" size={14} color="#7C3AED" />
                  </View>
                </Pressable>
              </View>
            </View>

            {/* ── 6. Available Now ── */}
            <AvailableNowSection spaces={homeData.availableNow} />

            {/* ── 7. Best Value Near You ── */}
            <BestValueSection spaces={homeData.bestValue} />

            {/* ── 8. Newly Listed ── */}
            <NewlyListedSection spaces={homeData.newlyListed} />

            {/* ── 9. Spaces by Category ── */}
            <CategoryCountsSection categories={homeData.categories} />

            {/* ── 10. High Visibility Spaces ── */}
            <HighVisibilitySection spaces={homeData.highVisibility} />

            {/* ── 11. Recommended For You ── */}
            {homeData.recommended && homeData.recommended.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeaderFlex}>
                  <Text style={styles.sectionTitle}>Recommended For You</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push("/Buyer/Screens/DiscoverScreen")}
                  >
                    <Text style={styles.seeAllText}>Explore</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={homeData.recommended}
                  keyExtractor={(item) => item._id || item.id}
                  contentContainerStyle={styles.cardsContainer}
                  renderItem={({ item }) => (
                    <AdvertisementSpaceCard
                      item={item}
                      badgeText="RECOMMENDED"
                      badgeBg="#2563EB"
                    />
                  )}
                />
              </View>
            ) : null}

            {/* ── 12. Explore on Map ── */}
            <ExploreMapSection
              spaces={homeData.nearby.length > 0 ? homeData.nearby : homeData.featured}
              userLocation={userLocationText}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollStyle: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp("15%"),
  },

  // ── Header
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 10 : 6,
    paddingBottom: 14,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.border,
  },
  profileInfo: {
    flex: 1,
  },
  welcomeGreeting: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  welcomeName: {
    color: colors.textPrimary,
    fontWeight: "800",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
    flexShrink: 1,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#EF4444",
  },

  // ── Search & Filter Bar
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 20,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    height: "100%",
    paddingVertical: 0,
  },
  searchFilterBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  // ── Sections
  section: {
    marginBottom: 24,
  },
  sectionHeaderFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 14,
  },

  // ── Channels
  channelsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  channelsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  channelCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  channelIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  channelTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  channelSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginBottom: 10,
  },
  channelArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
  },
});
