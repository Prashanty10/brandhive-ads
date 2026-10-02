import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../Theme/colors";
import { getAdSpaceDetailApi } from "../Api/adspaceApi";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=800&auto=format&fit=crop&q=80";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Specs & Reach" },
  { id: "location", label: "Features & Map" },
];

const AdvertisementDetailsScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [adspace, setAdspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getAdSpaceDetailApi(id);
      if (res?.success && res?.data) {
        setAdspace(res.data);
      }
    } catch (error) {
      console.error("Error loading advertisement details:", error);
      Alert.alert("Error", "Unable to load space details.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!adspace) return;
    router.push({
      pathname: "/Buyer/Screens/BookingScreen",
      params: { adspaceId: adspace._id || id },
    });
  };

  const handleContactSeller = () => {
    const seller = adspace?.sellerID;
    const phone =
      adspace?.sellerMobile ||
      seller?.mobileNumber ||
      seller?.mobile ||
      seller?.phone ||
      "9876543210";
    const cleanPhone = phone.replace(/[^0-9+]/g, "");

    Alert.alert(
      "Contact Media Seller",
      `Call ${sellerName} directly at ${phone}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call Now", onPress: () => Linking.openURL(`tel:${cleanPhone}`) },
      ]
    );
  };

  const handleWhatsappSeller = () => {
    const seller = adspace?.sellerID;
    const phone =
      adspace?.sellerMobile ||
      seller?.mobileNumber ||
      seller?.mobile ||
      seller?.phone ||
      "9876543210";
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const msg = `Hi ${sellerName}, I am interested in your advertisement space "${adspace.title}" listed on BrandHive.`;
    Linking.openURL(
      `https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}?text=${encodeURIComponent(msg)}`
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Space Information...</Text>
      </SafeAreaView>
    );
  }

  if (!adspace) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.errorTitle}>Space Not Found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const images =
    Array.isArray(adspace.images) && adspace.images.length > 0
      ? adspace.images
      : [DEFAULT_IMAGE];

  const priceNum = Number(adspace.price || 0);
  const priceFormatted = `₹${priceNum.toLocaleString("en-IN")}`;
  const sellerName = adspace.sellerID
    ? `${adspace.sellerID.firstName || ""} ${adspace.sellerID.lastName || ""}`.trim() || "Verified Seller"
    : "Verified Media Partner";
  const sellerMobileNumber =
    adspace.sellerMobile ||
    adspace.sellerID?.mobileNumber ||
    adspace.sellerID?.mobile ||
    adspace.sellerID?.phone ||
    "+91 98765 43210";
  const isVerified = Boolean(adspace.isVerified || adspace.sellerVerification);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.8} onPress={handleContactSeller}>
          <Ionicons name="call-outline" size={19} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Carousel Hero */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.floor(
                e.nativeEvent.contentOffset.x / (e.nativeEvent.layoutMeasurement.width - 10)
              );
              if (slide !== activeImageIndex && slide >= 0 && slide < images.length) {
                setActiveImageIndex(slide);
              }
            }}
            scrollEventThrottle={16}
          >
            {images.map((imgUri, idx) => (
              <Image
                key={idx}
                source={{ uri: imgUri }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Carousel Overlay Elements */}
          <View style={styles.carouselMetaOverlay}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>
                {(adspace.category || adspace.displayType || "Billboard").toUpperCase()}
              </Text>
            </View>

            {images.length > 1 && (
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>
                  {activeImageIndex + 1} / {images.length}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Content Container */}
        <View style={styles.contentBody}>
          {/* Main Title & Location */}
          <View style={styles.mainTitleCard}>
            <Text style={styles.titleText}>{adspace.title}</Text>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={15} color="#EF4444" />
              <Text style={styles.locationText} numberOfLines={2}>
                {adspace.location?.address
                  ? adspace.location.address
                  : `${adspace.location?.city || ""}${adspace.location?.state ? `, ${adspace.location.state}` : ""}`}
              </Text>
            </View>

            <View style={styles.tagsRow}>
              {isVerified && (
                <View style={styles.verifiedTag}>
                  <Ionicons name="checkmark-circle" size={12} color="#059669" />
                  <Text style={styles.verifiedTagText}>Verified Seller</Text>
                </View>
              )}

              <View style={styles.bookingTypeTag}>
                <Ionicons
                  name={adspace.bookingType === "Instant Booking" ? "flash-outline" : "paper-plane-outline"}
                  size={12}
                  color={colors.primary}
                />
                <Text style={styles.bookingTypeTagText}>
                  {adspace.bookingType || "Instant Booking"}
                </Text>
              </View>

              {adspace.availability?.isAvailable !== false && (
                <View style={styles.availableTag}>
                  <View style={styles.availDot} />
                  <Text style={styles.availableTagText}>Available Now</Text>
                </View>
              )}
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Price</Text>
              <Text style={styles.metricValuePrimary}>{priceFormatted}</Text>
              <Text style={styles.metricSub}>{adspace.priceUnit || "per month"}</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Dimensions</Text>
              <Text style={styles.metricValue}>{adspace.dimensions || "Standard"}</Text>
              <Text style={styles.metricSub}>Size</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Visibility</Text>
              <Text style={styles.metricValue}>{adspace.visibility || "24 Hours"}</Text>
              <Text style={styles.metricSub}>Hours</Text>
            </View>
          </View>

          {/* Clean Segmented Tab Navigation */}
          <View style={styles.tabsContainer}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tab 1: OVERVIEW */}
          {activeTab === "overview" && (
            <View style={styles.tabContentBlock}>
              {/* Description */}
              {adspace.description ? (
                <View style={styles.cleanSection}>
                  <Text style={styles.cleanSectionTitle}>About This Space</Text>
                  <Text style={styles.descriptionText}>{adspace.description}</Text>
                </View>
              ) : null}

              {/* Seller Information Card */}
              <View style={styles.cleanSection}>
                <Text style={styles.cleanSectionTitle}>Seller & Contact Information</Text>
                <View style={styles.sellerCard}>
                  <View style={styles.sellerAvatar}>
                    <Ionicons name="person" size={20} color={colors.primary} />
                  </View>

                  <View style={styles.sellerInfo}>
                    <Text style={styles.sellerNameText}>{sellerName}</Text>
                    <View style={styles.sellerPhoneRow}>
                      <Ionicons name="call-outline" size={13} color="#059669" />
                      <Text style={styles.sellerPhoneText}>{sellerMobileNumber}</Text>
                    </View>
                    <Text style={styles.sellerSubText}>BrandHive Verified Media Seller</Text>
                  </View>

                  <View style={styles.sellerActionCol}>
                    <TouchableOpacity
                      style={styles.contactBtnSmall}
                      onPress={handleContactSeller}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="call" size={13} color={colors.white} />
                      <Text style={styles.contactBtnSmallText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.whatsappBtnSmall}
                      onPress={handleWhatsappSeller}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="logo-whatsapp" size={13} color={colors.white} />
                      <Text style={styles.contactBtnSmallText}>Chat</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Tab 2: SPECS & REACH */}
          {activeTab === "specs" && (
            <View style={styles.tabContentBlock}>
              <View style={styles.cleanSection}>
                <Text style={styles.cleanSectionTitle}>Technical Specifications</Text>

                <View style={styles.specList}>
                  <View style={styles.specRowItem}>
                    <Ionicons name="resize-outline" size={16} color={colors.primary} />
                    <Text style={styles.specRowLabel}>Dimensions</Text>
                    <Text style={styles.specRowValue}>{adspace.dimensions || "N/A"}</Text>
                  </View>

                  <View style={styles.specRowItem}>
                    <Ionicons name="eye-outline" size={16} color="#7C3AED" />
                    <Text style={styles.specRowLabel}>Visibility</Text>
                    <Text style={styles.specRowValue}>{adspace.visibility || "24 Hours"}</Text>
                  </View>

                  <View style={styles.specRowItem}>
                    <Ionicons name="bulb-outline" size={16} color="#D97706" />
                    <Text style={styles.specRowLabel}>Lighting</Text>
                    <Text style={styles.specRowValue}>{adspace.lighting || "Non-lit"}</Text>
                  </View>

                  <View style={styles.specRowItem}>
                    <Ionicons name="time-outline" size={16} color="#059669" />
                    <Text style={styles.specRowLabel}>Operating Hours</Text>
                    <Text style={styles.specRowValue}>{adspace.operatingHours || "24 Hours"}</Text>
                  </View>

                  <View style={styles.specRowItem}>
                    <Ionicons name="calendar-outline" size={16} color="#2563EB" />
                    <Text style={styles.specRowLabel}>Min Booking Duration</Text>
                    <Text style={styles.specRowValue}>{adspace.minimumBookingDuration || "1 day"}</Text>
                  </View>
                </View>
              </View>

              {/* Reach & Traffic Metrics */}
              {(adspace.estimatedDailyImpressions > 0 || adspace.estimatedFootfall > 0) && (
                <View style={styles.cleanSection}>
                  <Text style={styles.cleanSectionTitle}>Reach & Traffic Metrics</Text>
                  <View style={styles.trafficRowContainer}>
                    {adspace.estimatedDailyImpressions > 0 && (
                      <View style={styles.trafficBox}>
                        <Ionicons name="trending-up" size={22} color="#059669" />
                        <Text style={styles.trafficNumber}>
                          {(adspace.estimatedDailyImpressions / 1000).toFixed(0)}K
                        </Text>
                        <Text style={styles.trafficLabel}>Est. Daily Impressions</Text>
                      </View>
                    )}

                    {adspace.estimatedFootfall > 0 && (
                      <View style={styles.trafficBox}>
                        <Ionicons name="walk" size={22} color="#2563EB" />
                        <Text style={styles.trafficNumber}>
                          {(adspace.estimatedFootfall / 1000).toFixed(0)}K
                        </Text>
                        <Text style={styles.trafficLabel}>Est. Daily Footfall</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Tab 3: FEATURES & LOCATION */}
          {activeTab === "location" && (
            <View style={styles.tabContentBlock}>
              {/* Target Audience */}
              {Array.isArray(adspace.audienceInformation) && adspace.audienceInformation.length > 0 && (
                <View style={styles.cleanSection}>
                  <Text style={styles.cleanSectionTitle}>Target Audience</Text>
                  <View style={styles.chipsWrapper}>
                    {adspace.audienceInformation.map((aud, idx) => (
                      <View key={idx} style={styles.audiencePill}>
                        <Ionicons name="people-outline" size={13} color="#7C3AED" />
                        <Text style={styles.pillText}>{aud}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Amenities */}
              {Array.isArray(adspace.amenities) && adspace.amenities.length > 0 && (
                <View style={styles.cleanSection}>
                  <Text style={styles.cleanSectionTitle}>Features & Amenities</Text>
                  <View style={styles.chipsWrapper}>
                    {adspace.amenities.map((amenity, idx) => (
                      <View key={idx} style={styles.amenityPill}>
                        <Ionicons name="checkmark-circle-outline" size={13} color="#2563EB" />
                        <Text style={styles.pillText}>{amenity}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Location Map Preview Box */}
              <View style={styles.cleanSection}>
                <Text style={styles.cleanSectionTitle}>Exact Location Coordinates</Text>
                <View style={styles.mapCard}>
                  <Ionicons name="map" size={28} color={colors.primary} />
                  <Text style={styles.mapCardAddress}>
                    {adspace.location?.address || `${adspace.location?.city || ""}, ${adspace.location?.state || ""}`}
                  </Text>
                  {adspace.location?.latitude != null && (
                    <Text style={styles.mapCardCoords}>
                      GPS: {adspace.location.latitude.toFixed(4)}, {adspace.location.longitude.toFixed(4)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabelBottom}>Total Rent</Text>
          <View style={styles.priceRowBottom}>
            <Text style={styles.priceAmountBottom}>{priceFormatted}</Text>
            <Text style={styles.priceUnitBottom}> / {adspace.priceUnit || "month"}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookBtnLarge}
          onPress={handleBookNow}
          activeOpacity={0.88}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdvertisementDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: "700",
  },

  floatingHeader: {
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 10,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  scrollContent: {
    paddingBottom: hp("12%"),
  },
  carouselContainer: {
    width: SCREEN_WIDTH,
    height: hp("32%"),
    position: "relative",
    backgroundColor: colors.neutralLight,
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: hp("32%"),
  },
  carouselMetaOverlay: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryPill: {
    backgroundColor: "rgba(17, 24, 39, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryPillText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  counterBadge: {
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  counterText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },

  contentBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },

  mainTitleCard: {
    gap: 8,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
    flex: 1,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#047857",
  },
  bookingTypeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bookingTypeTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  availableTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  availableTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#047857",
  },

  metricsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  metricValuePrimary: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  metricSub: {
    fontSize: 10,
    color: colors.textMuted,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },

  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.neutralLight,
    borderRadius: 14,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: "800",
  },

  tabContentBlock: {
    gap: 16,
  },
  cleanSection: {
    gap: 8,
  },
  cleanSectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  sellerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  sellerPhoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginVertical: 2,
  },
  sellerPhoneText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  sellerSubText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  sellerActionCol: {
    flexDirection: "column",
    gap: 6,
  },
  contactBtnSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  whatsappBtnSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  contactBtnSmallText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
  },

  specList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  specRowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: 10,
  },
  specRowLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  specRowValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  trafficRowContainer: {
    flexDirection: "row",
    gap: 12,
  },
  trafficBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  trafficNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  trafficLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
  },

  chipsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  audiencePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  amenityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  mapCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  mapCardAddress: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  mapCardCoords: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 8,
  },
  priceContainer: {},
  priceLabelBottom: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  priceRowBottom: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceAmountBottom: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  priceUnitBottom: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  bookBtnLarge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 16,
  },
  bookBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
});
