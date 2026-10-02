import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../Theme/colors";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=800&auto=format&fit=crop&q=80";

const AdvertisementSpaceCard = ({
  item,
  badgeText,
  badgeBg = "#111827",
  badgeColor = colors.white,
  cardWidth = wp("78%"),
  onPress,
}) => {
  const router = useRouter();

  if (!item) return null;

  const imageUri =
    Array.isArray(item.images) && item.images.length > 0 && item.images[0]?.startsWith("http")
      ? item.images[0]
      : DEFAULT_IMAGE;

  const title = item.title || "Advertisement Space";
  const category = item.category || item.displayType || "Billboard";
  const address = item.location?.city
    ? `${item.location.city}${item.location.state ? `, ${item.location.state}` : ""}`
    : item.location?.address || "Location Available";

  const priceNum = Number(item.price) || 0;
  const priceFormatted = `₹${priceNum.toLocaleString("en-IN")}`;
  const priceUnit = item.priceUnit || "per month";
  const dimensions = item.dimensions || "";
  const distanceText = item.distanceKm != null ? `${item.distanceKm} km away` : null;
  const isVerified = Boolean(item.isVerified || item.sellerVerification);
  const isAvailable = Boolean(item.availability?.isAvailable !== false);
  const bookingType = item.bookingType || "Instant Booking";

  const handleCardPress = () => {
    if (onPress) {
      onPress(item);
    } else {
      router.push({
        pathname: "/Buyer/Screens/AdvertisementDetailsScreen",
        params: { id: item._id || item.id },
      });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      activeOpacity={0.92}
      onPress={handleCardPress}
    >
      {/* ── Card Image Container ── */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

        {/* Top Badges */}
        <View style={styles.topBadgesRow}>
          {badgeText ? (
            <View style={[styles.customBadge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.customBadgeText, { color: badgeColor }]}>
                {badgeText}
              </Text>
            </View>
          ) : (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{category.toUpperCase()}</Text>
            </View>
          )}

          {isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#047857" />
              <Text style={styles.verifiedBadgeText}>Verified Seller</Text>
            </View>
          )}
        </View>

        {/* Booking Type Pill */}
        <View style={styles.bookingTypePill}>
          <Ionicons
            name={bookingType === "Instant Booking" ? "flash" : "paper-plane"}
            size={10}
            color={colors.white}
          />
          <Text style={styles.bookingTypePillText}>{bookingType}</Text>
        </View>
      </View>

      {/* ── Card Content Body ── */}
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color="#EF4444" />
          <Text style={styles.locationText} numberOfLines={1}>
            {address}
          </Text>

          {distanceText && (
            <>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.distanceText}>{distanceText}</Text>
            </>
          )}
        </View>

        {/* Metadata Row: Dimensions & Visibility */}
        <View style={styles.metaRow}>
          {dimensions ? (
            <View style={styles.metaBadge}>
              <Ionicons name="resize-outline" size={11} color="#2563EB" />
              <Text style={styles.metaText}>{dimensions}</Text>
            </View>
          ) : null}

          {item.visibility ? (
            <View style={styles.metaBadge}>
              <Ionicons name="eye-outline" size={11} color="#7C3AED" />
              <Text style={styles.metaText}>{item.visibility}</Text>
            </View>
          ) : null}
        </View>

        {/* Impressions / Footfall row if available */}
        {item.estimatedDailyImpressions ? (
          <View style={styles.impressionsRow}>
            <Ionicons name="trending-up-outline" size={12} color="#047857" />
            <Text style={styles.impressionsText}>
              {(item.estimatedDailyImpressions / 1000).toFixed(0)}K estimated daily impressions
            </Text>
          </View>
        ) : null}

        {/* Footer Row */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{priceFormatted}</Text>
              <Text style={styles.priceUnit}> / {priceUnit.replace("per ", "")}</Text>
            </View>
            <View style={styles.availBadge}>
              <View
                style={[
                  styles.availDot,
                  { backgroundColor: isAvailable ? "#10B981" : "#EF4444" },
                ]}
              />
              <Text
                style={[
                  styles.availText,
                  { color: isAvailable ? "#047857" : "#EF4444" },
                ]}
              >
                {isAvailable ? "Available Now" : "Unavailable"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewBtn}
            activeOpacity={0.88}
            onPress={handleCardPress}
          >
            <Text style={styles.viewBtnText}>View Space</Text>
            <Ionicons name="arrow-forward" size={12} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AdvertisementSpaceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 155,
    position: "relative",
    backgroundColor: colors.divider,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  topBadgesRow: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  customBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  categoryBadge: {
    backgroundColor: "rgba(17, 24, 39, 0.85)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#047857",
  },
  bookingTypePill: {
    position: "absolute",
    bottom: 8,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(15, 23, 42, 0.78)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bookingTypePillText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.white,
  },
  cardContent: {
    padding: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    flexShrink: 1,
  },
  dotSeparator: {
    fontSize: 11,
    color: colors.textMuted,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.neutralLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  impressionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  impressionsText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#047857",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    marginTop: 2,
  },
  priceContainer: {
    justifyContent: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  priceUnit: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  availBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availText: {
    fontSize: 10,
    fontWeight: "700",
  },
  viewBtn: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  viewBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
});
