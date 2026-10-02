import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import colors from "../../../../Theme/colors";
import AdvertisementSpaceCard from "./AdvertisementSpaceCard";

const BestValueSection = ({ spaces = [] }) => {
  if (!spaces || spaces.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Best Value Near You</Text>
        <Text style={styles.sectionSubtitle}>
          Calculated based on price, reach, impressions & location value.
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
            badgeText="Good Value"
            badgeBg="#2563EB"
          />
        )}
      />
    </View>
  );
};

export default BestValueSection;

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
