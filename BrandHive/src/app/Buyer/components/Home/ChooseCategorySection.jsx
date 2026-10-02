import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import colors from "../../../../Theme/colors";
import { adCategoriesData } from "./data/adCategoriesData";

const ChooseCategorySection = () => {
  const router = useRouter();

  const handlePress = (categoryName) => {
    router.push({
      pathname: "/Buyer/advertisement/offline/OfflineCategoryScreen",
      params: { categoryName },
    });
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Choose Your Advertisement Space</Text>
        <Text style={styles.sectionSubtitle}>Find the right advertising medium</Text>
      </View>

      <View style={styles.grid}>
        {adCategoriesData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.88}
            onPress={() => handlePress(item.categoryName)}
          >
            <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>

            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.arrowRow}>
              <Text style={[styles.exploreText, { color: item.color }]}>Explore</Text>
              <Ionicons name="arrow-forward" size={12} color={item.color} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ChooseCategorySection;

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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    rowGap: 12,
  },
  card: {
    width: (wp("100%") - 52) / 2,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginBottom: 10,
    minHeight: 30,
  },
  arrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  exploreText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
