import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";

const ProfileCompletionCard = ({ user, onCompletePress, mode = "buyer" }) => {
  if (!user) return null;

  // Calculate filled fields
  const commonFields = [
    Boolean(user.firstName),
    Boolean(user.lastName),
    Boolean(user.email),
    Boolean(user.phoneNumber || user.mobileNumber || user.mobile),
    Boolean(user.city),
    Boolean(user.state),
    Boolean(user.profileImage),
    Boolean(user.bio),
  ];

  const sellerSpecificFields = mode === "seller" ? [
    Boolean(user.sellerProfile?.businessName),
    Boolean(user.sellerProfile?.businessAddress),
    Boolean(user.sellerProfile?.gstNumber || user.sellerProfile?.panNumber),
  ] : [];

  const allFields = [...commonFields, ...sellerSpecificFields];
  const filledCount = allFields.filter(Boolean).length;
  const percentage = Math.round((filledCount / allFields.length) * 100);

  // Requirement: if profile is completed fully (100%), do NOT show profile strength!
  if (percentage >= 100) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <Ionicons name="sparkles" size={16} color="#2563EB" />
          <Text style={styles.title}>Profile Strength</Text>
        </View>
        <Text style={styles.percentageText}>{percentage}% Complete</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.subtitle}>
          Complete your profile to build trust with {mode === "seller" ? "buyers" : "sellers"}
        </Text>
        {onCompletePress && (
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={onCompletePress}
          >
            <Text style={styles.actionText}>Complete Profile</Text>
            <Ionicons name="arrow-forward" size={14} color="#2563EB" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default ProfileCompletionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  percentageText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  subtitle: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
});
