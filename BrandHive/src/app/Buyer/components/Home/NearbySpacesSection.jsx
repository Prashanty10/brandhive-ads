import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../Theme/colors";
import AdvertisementSpaceCard from "./AdvertisementSpaceCard";

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

const NearbySpacesSection = ({
  spaces = [],
  selectedRadius = 25,
  onRadiusChange,
  locationAvailable = true,
  onRequestLocation,
}) => {
  if (!locationAvailable) {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spaces Near You</Text>
          <Text style={styles.sectionSubtitle}>
            Enable location services to discover advertisement spaces near you.
          </Text>
        </View>
        <View style={styles.emptyCard}>
          <View style={styles.iconBg}>
            <Ionicons name="location-outline" size={28} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Location Access Needed</Text>
          <Text style={styles.emptySubtitle}>
            Find hoardings, LED screens & transit ads in your current city.
          </Text>
          <TouchableOpacity
            style={styles.enableBtn}
            activeOpacity={0.8}
            onPress={onRequestLocation}
          >
            <Ionicons name="navigate" size={14} color={colors.white} />
            <Text style={styles.enableBtnText}>Set Your Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerTopRow}>
          <Text style={styles.sectionTitle}>
            {spaces.length} Spaces Near You
          </Text>
          <View style={styles.radiusPill}>
            <Ionicons name="location" size={11} color={colors.primary} />
            <Text style={styles.radiusPillText}>within {selectedRadius} km</Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>
          Real seller listings sorted by distance nearest to you first.
        </Text>
      </View>

      {/* Radius Selector Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.radiusContainer}
      >
        {RADIUS_OPTIONS.map((rad) => {
          const isSelected = selectedRadius === rad;
          return (
            <TouchableOpacity
              key={rad}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onRadiusChange && onRadiusChange(rad)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {rad} km
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {spaces.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="search-outline" size={24} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No advertisement spaces near you yet.</Text>
          <Text style={styles.emptySubtitle}>
            Try increasing your search radius to find spaces nearby.
          </Text>
          <TouchableOpacity
            style={styles.increaseRadiusBtn}
            onPress={() => onRadiusChange && onRadiusChange(100)}
          >
            <Text style={styles.increaseRadiusText}>Increase Radius to 100 km</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={spaces}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <AdvertisementSpaceCard
              item={item}
              badgeText={item.distanceKm != null ? `${item.distanceKm} km` : "NEAR YOU"}
              badgeBg={colors.primary}
            />
          )}
        />
      )}
    </View>
  );
};

export default NearbySpacesSection;

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  radiusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  radiusPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  radiusContainer: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  emptyCard: {
    marginHorizontal: 20,
    padding: 24,
    backgroundColor: colors.neutralLight,
    borderRadius: 20,
    alignItems: "center",
    gap: 8,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  enableBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 4,
  },
  enableBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  increaseRadiusBtn: {
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  increaseRadiusText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
});
