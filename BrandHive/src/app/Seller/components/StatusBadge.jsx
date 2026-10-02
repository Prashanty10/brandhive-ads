import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const STATUS_MAP = {
  active: { label: "Active", bg: "#ECFDF5", color: "#059669", icon: "checkmark-circle-outline" },
  pending: { label: "Pending", bg: "#FFFBEB", color: "#D97706", icon: "time-outline" },
  inactive: { label: "Inactive", bg: "#F3F4F6", color: "#6B7280", icon: "pause-circle-outline" },
  completed: { label: "Completed", bg: "#EFF6FF", color: "#2563EB", icon: "checkmark-done-outline" },
  cancelled: { label: "Cancelled", bg: "#FEF2F2", color: "#EF4444", icon: "close-circle-outline" },
};

const StatusBadge = ({ status, showIcon = true, style }) => {
  const key = (status || "active").toLowerCase();
  const config = STATUS_MAP[key] || STATUS_MAP.active;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, style]}>
      {showIcon && <Ionicons name={config.icon} size={11} color={config.color} />}
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

export default StatusBadge;

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
});
