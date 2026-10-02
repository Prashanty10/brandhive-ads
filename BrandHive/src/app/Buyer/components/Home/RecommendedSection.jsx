import React from "react";
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
import { recommendedSpacesData } from "./data/recommendedSpacesData";

const RecommendedSection = () => {
  const router = useRouter();

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => router.push("/Buyer/Screens/BookingScreen")}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.badge}>
          <Ionicons name="sparkles-outline" size={10} color="#FFFFFF" />
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.category}>{item.category}</Text>

        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color="#EF4444" />
          <Text style={styles.cityText}>{item.city}</Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.price}>{item.price}</Text>

          <TouchableOpacity
            style={styles.viewBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/Buyer/Screens/BookingScreen")}
          >
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended For You</Text>
        <Text style={styles.sectionSubtitle}>Based on your interests</Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={recommendedSpacesData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderCard}
      />
    </View>
  );
};

export default RecommendedSection;

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
    gap: 14,
  },
  card: {
    width: wp("54%"),
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: hp("14%"),
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#2563EB",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  cardContent: {
    padding: 12,
  },
  category: {
    fontSize: 10,
    fontWeight: "700",
    color: "#7C3AED",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  cityText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  price: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  viewBtn: {
    backgroundColor: colors.neutralLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewBtnText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
  },
});
