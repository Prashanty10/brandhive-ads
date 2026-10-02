import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../Theme/colors";

const ExploreMapSection = ({ spaces = [], userLocation }) => {
  const router = useRouter();
  const [selectedSpace, setSelectedSpace] = useState(spaces[0] || null);

  if (!spaces || spaces.length === 0) return null;

  const activeSpace = selectedSpace || spaces[0];

  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num)) return "N/A";
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const imageUri =
    Array.isArray(activeSpace?.images) && activeSpace.images.length > 0
      ? activeSpace.images[0]
      : "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=800&auto=format&fit=crop&q=80";

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Explore Nearby on Map</Text>
          <View style={styles.mapBadge}>
            <Ionicons name="map-outline" size={11} color={colors.primary} />
            <Text style={styles.mapBadgeText}>GPS LIVE</Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>
          Tap any marker pin to inspect real seller advertisement space details.
        </Text>
      </View>

      <View style={styles.mapContainer}>
        {/* Map Preview Canvas */}
        <View style={styles.mapCanvas}>
          <View style={styles.gridLineHorizontal1} />
          <View style={styles.gridLineHorizontal2} />
          <View style={styles.gridLineVertical1} />
          <View style={styles.gridLineVertical2} />

          {/* User Location Radar Dot */}
          <View style={styles.userLocationRadar}>
            <View style={styles.userDot} />
            <Text style={styles.userLabel}>You</Text>
          </View>

          {/* Real Seller Space Markers */}
          {spaces.slice(0, 6).map((space, idx) => {
            const isSelected = activeSpace?._id === space._id;
            // Generate deterministic pin positions across the grid for visual layout
            const topPositions = ["20%", "55%", "30%", "70%", "40%", "15%"];
            const leftPositions = ["25%", "65%", "80%", "30%", "48%", "75%"];
            const topPos = topPositions[idx % topPositions.length];
            const leftPos = leftPositions[idx % leftPositions.length];

            return (
              <TouchableOpacity
                key={space._id || idx}
                style={[
                  styles.markerPin,
                  { top: topPos, left: leftPos },
                  isSelected && styles.markerPinActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedSpace(space)}
              >
                <Ionicons
                  name="easel"
                  size={14}
                  color={isSelected ? colors.white : colors.primary}
                />
                <Text
                  style={[
                    styles.markerPriceText,
                    isSelected && styles.markerPriceTextActive,
                  ]}
                >
                  ₹{Number(space.price || 0) >= 1000
                    ? `${(Number(space.price) / 1000).toFixed(0)}k`
                    : space.price}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Space Preview Card */}
        {activeSpace && (
          <View style={styles.selectedCardContainer}>
            <View style={styles.cardHeaderRow}>
              <Image source={{ uri: imageUri }} style={styles.cardImage} />
              <View style={styles.cardMainInfo}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {(activeSpace.category || "Billboard").toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {activeSpace.title}
                </Text>
                <Text style={styles.cardLocation} numberOfLines={1}>
                  <Ionicons name="location-outline" size={11} color="#EF4444" />{" "}
                  {activeSpace.location?.city || "Location available"}
                  {activeSpace.distanceKm != null ? ` • ${activeSpace.distanceKm} km away` : ""}
                </Text>
              </View>
            </View>

            <View style={styles.cardFooterRow}>
              <View>
                <Text style={styles.cardPrice}>
                  {formatPrice(activeSpace.price)}
                </Text>

                <Text style={styles.cardPriceUnit}>
                  {activeSpace.priceUnit || "per month"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.viewBtn}
                activeOpacity={0.88}
                onPress={() =>
                  router.push({
                    pathname: "/Buyer/Screens/AdvertisementDetailsScreen",
                    params: { id: activeSpace._id },
                  })
                }
              >
                <Text style={styles.viewBtnText}>View Space</Text>
                <Ionicons name="arrow-forward" size={12} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ExploreMapSection;

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mapBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  mapBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
  },
  mapContainer: {
    marginHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
  },
  mapCanvas: {
    width: "100%",
    height: hp("22%"),
    backgroundColor: "#EFF6FF",
    position: "relative",
  },
  gridLineHorizontal1: {
    position: "absolute",
    top: "33%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
  },
  gridLineHorizontal2: {
    position: "absolute",
    top: "66%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
  },
  gridLineVertical1: {
    position: "absolute",
    left: "33%",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
  },
  gridLineVertical2: {
    position: "absolute",
    left: "66%",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
  },
  userLocationRadar: {
    position: "absolute",
    top: "45%",
    left: "45%",
    alignItems: "center",
  },
  userDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#3B82F6",
    borderWidth: 3,
    borderColor: colors.white,
  },
  userLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 2,
  },
  markerPin: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerPinActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  markerPriceText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  markerPriceTextActive: {
    color: colors.white,
  },
  selectedCardContainer: {
    backgroundColor: colors.white,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cardHeaderRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  cardImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  cardMainInfo: {
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: colors.neutralLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 2,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.textSecondary,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  cardLocation: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  cardPriceUnit: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
});
