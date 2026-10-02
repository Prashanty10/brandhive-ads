import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BrandHiveLogo = ({
  size = "medium", // 'small' | 'medium' | 'large'
  variant = "dark", // 'dark' | 'light' | 'primary'
  showText = true,
  textColor,
  style,
}) => {
  const badgeSize = size === "small" ? 32 : size === "large" ? 48 : 38;
  const borderRadius = size === "small" ? 8 : size === "large" ? 14 : 10;
  const fontSize = size === "small" ? 15 : size === "large" ? 24 : 18;
  const textFontSize = size === "small" ? 16 : size === "large" ? 24 : 20;

  const badgeBg =
    variant === "primary"
      ? "#2563EB"
      : variant === "light"
      ? "#FFFFFF"
      : "#111827";

  const badgeTextColor = variant === "light" ? "#111827" : "#FFFFFF";
  const labelColor =
    textColor || (variant === "light" ? "#FFFFFF" : "#111827");

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.badge,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: borderRadius,
            backgroundColor: badgeBg,
          },
        ]}
      >
        <Text style={[styles.badgeText, { fontSize, color: badgeTextColor }]}>
          BH
        </Text>
      </View>
      {showText && (
        <Text
          style={[
            styles.titleText,
            { fontSize: textFontSize, color: labelColor },
          ]}
        >
          BrandHive
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeText: {
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  titleText: {
    fontWeight: "800",
    letterSpacing: -0.5,
  },
});

export default BrandHiveLogo;
