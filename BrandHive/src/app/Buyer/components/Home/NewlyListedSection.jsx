import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import colors from "../../../../Theme/colors";
import AdvertisementSpaceCard from "./AdvertisementSpaceCard";

const getRelativeTime = (dateStr) => {
  if (!dateStr) return "NEW";
  try {
    const now = new Date();
    const created = new Date(dateStr);
    const diffHours = Math.floor((now - created) / (1000 * 60 * 60));
    if (diffHours < 1) return "Listed just now";
    if (diffHours < 24) return `Listed ${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Listed 1 day ago";
    return `Listed ${diffDays} days ago`;
  } catch {
    return "NEW";
  }
};

const NewlyListedSection = ({ spaces = [] }) => {
  if (!spaces || spaces.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Newly Listed</Text>
        <Text style={styles.sectionSubtitle}>
          Fresh advertisement spaces recently published by verified sellers.
        </Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={spaces}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <AdvertisementSpaceCard
            item={item}
            badgeText={getRelativeTime(item.createdAt)}
            badgeBg="#7C3AED"
          />
        )}
      />
    </View>
  );
};

export default NewlyListedSection;

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
