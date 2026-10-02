import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import colors from "../../../../Theme/colors";
import AdvertisementSpaceCard from "./AdvertisementSpaceCard";

const HighVisibilitySection = ({ spaces = [] }) => {
  if (!spaces || spaces.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>High Visibility Spaces</Text>
        <Text style={styles.sectionSubtitle}>
          Prime locations with verified daily impressions & high footfall.
        </Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={spaces}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          let badgeText = "HIGH VISIBILITY";
          if (item.estimatedDailyImpressions) {
            badgeText = `${(item.estimatedDailyImpressions / 1000).toFixed(0)}K IMPRESSIONS/DAY`;
          } else if (item.visibility === "24 Hours") {
            badgeText = "24/7 VISIBILITY";
          }
          return (
            <AdvertisementSpaceCard
              item={item}
              badgeText={badgeText}
              badgeBg="#EA580C"
            />
          );
        }}
      />
    </View>
  );
};

export default HighVisibilitySection;

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
  listContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
});
