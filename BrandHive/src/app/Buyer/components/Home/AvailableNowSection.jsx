import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../Theme/colors";
import AdvertisementSpaceCard from "./AdvertisementSpaceCard";

const AvailableNowSection = ({ spaces = [] }) => {
  if (!spaces || spaces.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.sectionTitle}>Available Now</Text>
          <View style={styles.liveDotPill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveDotText}>LIVE</Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>
          Spaces ready for immediate booking & deployment today.
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
            badgeText="AVAILABLE NOW"
            badgeBg="#10B981"
          />
        )}
      />
    </View>
  );
};

export default AvailableNowSection;

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerTitleRow: {
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
  liveDotPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  liveDotText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
});
