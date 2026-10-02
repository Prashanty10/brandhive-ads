import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../../Theme/colors";

const SettingsSection = ({ title, children }) => {
  return (
    <View style={styles.sectionContainer}>
      {title ? <Text style={styles.sectionLabel}>{title}</Text> : null}
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
};

export default SettingsSection;

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: 6,
    letterSpacing: 0.8,
    paddingLeft: 4,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
});
