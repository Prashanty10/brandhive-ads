import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";

const StatCard = ({ icon, iconColor = colors.primary, iconBg = "#EFF6FF", count, label, subtext, onPress, style }) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[styles.card, style]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        {onPress && (
          <Ionicons name="arrow-forward" size={14} color={colors.textMuted} />
        )}
      </View>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </CardComponent>
  );
};

export default StatCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  count: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 18,
  },
  subtext: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
