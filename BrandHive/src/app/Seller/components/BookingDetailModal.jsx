import React from "react";
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";
import StatusBadge from "./StatusBadge";

const BookingDetailModal = ({ visible, booking, onClose, onAccept, onDecline, isUpdating }) => {
  if (!booking) return null;

  const buyer = booking.buyerID || {};
  const space = booking.adspaceID || {};

  const buyerName = buyer.firstName
    ? `${buyer.firstName} ${buyer.lastName || ""}`.trim()
    : buyer.name || "Buyer Customer";

  const priceFormatted = `₹${Number(booking.totalPrice || space.price || 0).toLocaleString("en-IN")}`;
  const imageUri =
    Array.isArray(space.images) && space.images.length > 0
      ? space.images[0]
      : "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=60";

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch { return "N/A"; }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Booking Request Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Status & ID */}
            <View style={styles.statusRow}>
              <StatusBadge status={booking.status} />
              <Text style={styles.bookingIdText}>ID: #{String(booking._id || "").slice(-6).toUpperCase()}</Text>
            </View>

            {/* Buyer Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>BUYER INFORMATION</Text>
              <View style={styles.infoCard}>
                <View style={styles.avatarBox}>
                  <Ionicons name="person" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.buyerNameText}>{buyerName}</Text>
                  {buyer.email ? <Text style={styles.subText}>{buyer.email}</Text> : null}
                  {buyer.mobile ? <Text style={styles.subText}>{buyer.mobile}</Text> : null}
                </View>
              </View>
            </View>

            {/* Ad Space Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ADVERTISEMENT SPACE</Text>
              <View style={styles.spaceCard}>
                <Image source={{ uri: imageUri }} style={styles.spaceImg} />
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={styles.spaceTitleText} numberOfLines={1}>{space.title || "Ad Space"}</Text>
                  <Text style={styles.subText}>{space.category || "General"} • {space.location?.city || "Location Specified"}</Text>
                  <Text style={styles.priceText}>{priceFormatted}</Text>
                </View>
              </View>
            </View>

            {/* Campaign Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CAMPAIGN PERIOD & BUDGET</Text>
              <View style={styles.gridBox}>
                <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>START DATE</Text>
                  <Text style={styles.gridVal}>{formatDate(booking.startDate)}</Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>END DATE</Text>
                  <Text style={styles.gridVal}>{formatDate(booking.endDate)}</Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>TOTAL BUDGET</Text>
                  <Text style={[styles.gridVal, { color: colors.primary, fontWeight: "800" }]}>{priceFormatted}</Text>
                </View>
              </View>
            </View>

            {booking.notes ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>BUYER NOTES</Text>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>"{booking.notes}"</Text>
                </View>
              </View>
            ) : null}
          </ScrollView>

          {/* Action buttons if pending */}
          {(booking.status || "Pending").toLowerCase() === "pending" && (
            <View style={styles.actionsFooter}>
              <TouchableOpacity
                style={styles.declineBtn}
                onPress={() => onDecline(booking._id, buyerName)}
                disabled={isUpdating}
              >
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => onAccept(booking._id, buyerName)}
                disabled={isUpdating}
              >
                <Text style={styles.acceptText}>Accept Booking</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default BookingDetailModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.4)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 18,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingIdText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  buyerNameText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  spaceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spaceImg: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  spaceTitleText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  priceText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  gridBox: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridCol: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: 2,
  },
  gridVal: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  notesBox: {
    backgroundColor: "#FFFBEB",
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  notesText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontStyle: "italic",
  },
  actionsFooter: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  declineBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  declineText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  acceptBtn: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.button,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
  },
});
