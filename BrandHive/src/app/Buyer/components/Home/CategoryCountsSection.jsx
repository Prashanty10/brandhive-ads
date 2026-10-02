import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../../../Theme/colors";
import { adCategoriesData } from "./data/adCategoriesData";

const CategoryCountsSection = ({ categories = [] }) => {
  const router = useRouter();

  // Create a count map from real MongoDB aggregation data
  const countMap = {};
  if (Array.isArray(categories)) {
    categories.forEach((item) => {
      if (item.categoryName) {
        countMap[item.categoryName.toLowerCase()] = item.count || 0;
      }
    });
  }

  const handleCategoryPress = (categoryName) => {
    router.push({
      pathname: "/Buyer/Screens/DiscoverScreen",
      params: { category: categoryName },
    });
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Spaces by Category</Text>
        <Text style={styles.sectionSubtitle}>
          Real-time advertisement space count by advertising medium.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {adCategoriesData.map((cat) => {
          const key = cat.categoryName?.toLowerCase() || "";
          const realCount = countMap[key] || 0;

          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => handleCategoryPress(cat.categoryName)}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: `${cat.color || colors.primary}15` },
                ]}
              >
                <Ionicons
                  name={cat.icon || "megaphone-outline"}
                  size={22}
                  color={cat.color || colors.primary}
                />
              </View>

              <Text style={styles.categoryName} numberOfLines={1}>
                {cat.name}
              </Text>
              <Text style={styles.countText}>
                {realCount} {realCount === 1 ? "space" : "spaces"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoryCountsSection;

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
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
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: 140,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    alignItems: "flex-start",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.1,
    marginBottom: 2,
  },
  countText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});
