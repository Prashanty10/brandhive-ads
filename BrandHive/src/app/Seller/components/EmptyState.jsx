import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";

const EmptyState = ({
  icon = "folder-open-outline",
  title = "No data found",
  description = "There are no items to display at this time.",
  buttonTitle,
  onButtonPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={32} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {buttonTitle && onButtonPress && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={onButtonPress}
        >
          <Ionicons name="add" size={18} color={colors.white} />
          <Text style={styles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
    maxWidth: 280,
  },
  button: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: colors.button,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
