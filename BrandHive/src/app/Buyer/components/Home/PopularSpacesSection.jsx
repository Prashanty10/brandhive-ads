import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../Theme/colors";
import { popularSpacesData } from "./data/popularSpacesData";

const PopularSpacesSection = () => {
  const router = useRouter();
  const [savedIds, setSavedIds] = useState({ pop_1: true, pop_3: true });

  const toggleSave = (id) => {
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCard = ({ item }) => {
    const isSaved = Boolean(savedIds[item.id]);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.92}
        onPress={() => router.push("/Buyer/Screens/BookingScreen")}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>POPULAR</Text>
          </View>

          <TouchableOpacity
            style={styles.heartBtn}
            activeOpacity={0.8}
            onPress={() => toggleSave(item.id)}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={18}
              color={isSaved ? "#EF4444" : "#1F2937"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color="#EF4444" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Ionicons name="eye-outline" size={12} color="#2563EB" />
              <Text style={styles.metaText}>{item.views}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Ionicons name="calendar-outline" size={12} color="#059669" />
              <Text style={styles.metaText}>{item.bookings}</Text>
            </View>
          </View>

          <View style={styles.footerRow}>
            <View>
              <Text style={styles.price}>{item.price}</Text>
              <View style={styles.availBadge}>
                <View style={styles.availDot} />
                <Text style={styles.availText}>{item.availability}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewBtn}
              activeOpacity={0.88}
              onPress={() => router.push("/Buyer/Screens/BookingScreen")}
            >
              <Text style={styles.viewBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Advertisement Spaces</Text>
        <Text style={styles.sectionSubtitle}>
          Discover the most booked advertisement spaces.
        </Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={popularSpacesData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderCard}
      />
    </View>
  );
};

export default PopularSpacesSection;

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
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
  listContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: wp("78%"),
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: hp("20%"),
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#111827",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  popularBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  heartBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.neutralLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
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
    backgroundColor: "#10B981",
  },
  availText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
  },
  viewBtn: {
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  viewBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
});
