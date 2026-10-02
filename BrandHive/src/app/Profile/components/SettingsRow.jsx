import React from "react";
import { View, Text, StyleSheet, Pressable, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";

const SettingsRow = ({
  icon,
  iconColor,
  title,
  subtitle,
  value,
  badge,
  badgeColor,
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
  isDestructive = false,
  hideChevron = false,
  isLast = false,
  onPress,
  disabled = false,
}) => {
  const activeIconColor = isDestructive
    ? colors.error
    : iconColor || colors.textPrimary;

  const badgeBg = isDestructive
    ? "#FEF2F2"
    : iconColor
    ? `${iconColor}15`
    : colors.neutralLight;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.rowItem,
        isLast && styles.noBorder,
        pressed && !isSwitch && onPress && styles.rowItemPressed,
        disabled && styles.disabledRow,
      ]}
      onPress={isSwitch ? undefined : onPress}
      disabled={disabled || isSwitch || !onPress}
    >
      <View style={styles.rowLeft}>
        {icon ? (
          <View style={[styles.iconBadge, { backgroundColor: badgeBg }]}>
            <Ionicons name={icon} size={18} color={activeIconColor} />
          </View>
        ) : null}

        <View style={styles.textWrapper}>
          <Text
            style={[
              styles.rowTitle,
              isDestructive && styles.destructiveText,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.rowSubtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rowRight}>
        {badge ? (
          <View
            style={[
              styles.badgeContainer,
              badgeColor ? { backgroundColor: `${badgeColor}15` } : null,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                badgeColor ? { color: badgeColor } : null,
              ]}
            >
              {badge}
            </Text>
          </View>
        ) : null}

        {value ? (
          <Text style={styles.rowValue} numberOfLines={1}>
            {value}
          </Text>
        ) : null}

        {isSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
            thumbColor={switchValue ? colors.button : "#94A3B8"}
          />
        ) : !hideChevron && onPress ? (
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        ) : null}
      </View>
    </Pressable>
  );
};

export default SettingsRow;

const styles = StyleSheet.create({
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  rowItemPressed: {
    backgroundColor: colors.background,
  },
  disabledRow: {
    opacity: 0.6,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  textWrapper: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  rowSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textSecondary,
    marginTop: 2,
  },
  destructiveText: {
    color: colors.error,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 8,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  badgeContainer: {
    backgroundColor: colors.neutralLight,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
