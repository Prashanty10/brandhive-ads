import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";

const ProfileHeader = ({ user, onEditPress, mode = "buyer" }) => {
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : "BrandHive User";
  const username = user?.username ? `@${user.username}` : "";
  const email = user?.email || "No email provided";
  const phone = user?.phoneNumber || user?.mobileNumber || user?.mobile || "No phone added";
  const avatarUri =
    user?.profileImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";

  const hasDualRole = user?.roles && Array.isArray(user.roles) && user.roles.includes("buyer") && user.roles.includes("seller");
  const activeRoleLabel = mode === "seller" ? "Seller Account" : "Buyer Account";
  const roleBadgeColor = mode === "seller" ? "#7C3AED" : "#2563EB";
  const roleBadgeBg = mode === "seller" ? "#F3E8FF" : "#EFF6FF";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Pressable
          style={({ pressed }) => [
            styles.avatarWrapper,
            pressed && { opacity: 0.8 },
          ]}
          onPress={onEditPress}
        >
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={11} color="#FFF" />
          </View>
        </Pressable>

        <View style={styles.infoWrapper}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {fullName}
            </Text>
            <View style={[styles.roleChip, { backgroundColor: roleBadgeBg }]}>
              <Ionicons
                name={mode === "seller" ? "briefcase-outline" : "person-outline"}
                size={11}
                color={roleBadgeColor}
              />
              <Text style={[styles.roleChipText, { color: roleBadgeColor }]}>
                {activeRoleLabel}
              </Text>
            </View>
            {hasDualRole && (
              <View style={styles.dualBadge}>
                <Ionicons name="swap-horizontal" size={10} color={colors.textSecondary} />
                <Text style={styles.dualBadgeText}>Dual</Text>
              </View>
            )}
          </View>

          {username ? (
            <Text style={styles.usernameText} numberOfLines={1}>
              {username}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.contactDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={14} color="#3B82F6" />
          <Text style={styles.detailText} numberOfLines={1}>
            {email}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={14} color="#10B981" />
          <Text style={styles.detailText} numberOfLines={1}>
            {phone}
          </Text>
        </View>
      </View>

      {onEditPress && (
        <Pressable
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.editButtonPressed,
          ]}
          onPress={onEditPress}
        >
          <Ionicons name="create-outline" size={16} color="#FFF" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>
      )}
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.border,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563EB",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  infoWrapper: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nameText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  usernameText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textSecondary,
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    flexWrap: "wrap",
  },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: "700",
  },
  dualBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.neutralLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dualBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 14,
  },
  contactDetails: {
    gap: 8,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  editButton: {
    width: "100%",
    height: 46,
    backgroundColor: colors.button,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editButtonPressed: {
    opacity: 0.88,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
