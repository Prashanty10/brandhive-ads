import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  RefreshControl,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../../../Theme/colors";
import {
  getSellerBookingsApi,
  updateBookingStatusApi,
} from "../../Buyer/Api/adspaceApi";
import usePaginatedList from "../../Buyer/components/common/usePaginatedList";
import FeedbackModal from "../../Buyer/components/common/FeedbackModal";
import StatusBadge from "../components/StatusBadge";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import BookingDetailModal from "../components/BookingDetailModal";
import { ActivityIndicator } from "react-native";

const TABS = ["Pending", "Active", "Completed", "Cancelled"];

const BookingsScreen = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Selected Booking for Detailed Modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Feedback Modal State
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
    details: null,
    primaryBtnText: "OK",
    onPrimaryPress: null,
  });

  const filters = React.useMemo(() => ({ status: activeTab }), [activeTab]);

  const {
    data: bookings,
    pagination,
    isLoading: loading,
    isLoadingMore,
    isRefreshing: refreshing,
    loadPage,
    refresh,
    loadMore,
    setData: setBookings,
  } = usePaginatedList(getSellerBookingsApi, filters, 20);

  useEffect(() => {
    loadPage(1);
  }, [activeTab]);

  const handleUpdateStatus = (bookingId, newStatus, buyerName) => {
    const isApprove = newStatus === "Active";
    const actionTitle = isApprove ? "Accept Booking" : "Decline Booking";
    const actionMsg = isApprove
      ? `Are you sure you want to accept the campaign booking request from ${buyerName}?`
      : `Are you sure you want to decline the campaign booking request from ${buyerName}?`;

    Alert.alert(actionTitle, actionMsg, [
      { text: "Cancel", style: "cancel" },
      {
        text: isApprove ? "Accept" : "Decline",
        style: isApprove ? "default" : "destructive",
        onPress: async () => {
          try {
            setActionLoadingId(bookingId);
            const res = await updateBookingStatusApi(bookingId, newStatus);
            if (res?.success) {
              setBookings((prev) =>
                prev.map((b) =>
                  b._id === bookingId ? { ...b, status: newStatus } : b
                )
              );
              if (selectedBooking?._id === bookingId) {
                setSelectedBooking((prev) => prev ? { ...prev, status: newStatus } : null);
              }
              setModalConfig({
                visible: true,
                type: isApprove ? "success" : "warning",
                title: isApprove ? "Request Approved! 🎉" : "Request Declined",
                message: isApprove
                  ? `Campaign booking for ${buyerName} has been approved and activated.`
                  : `Campaign booking request from ${buyerName} has been declined.`,
                primaryBtnText: "OK",
                onPrimaryPress: () => setModalConfig((prev) => ({ ...prev, visible: false })),
              });
            }
          } catch (err) {
            setModalConfig({
              visible: true,
              type: "error",
              title: "Update Failed ⚠️",
              message: err?.message || "Failed to update booking request status.",
              primaryBtnText: "OK",
              onPrimaryPress: () => setModalConfig((prev) => ({ ...prev, visible: false })),
            });
          } finally {
            setActionLoadingId(null);
          }
        },
      },
    ]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const renderItem = ({ item }) => {
    const statusKey = (item.status || "Pending").toLowerCase();
    const buyer = item.buyerID || {};
    const space = item.adspaceID || {};

    const buyerName = buyer.firstName
      ? `${buyer.firstName} ${buyer.lastName || ""}`.trim()
      : buyer.name || "Buyer Customer";

    const priceFormatted = `₹${Number(item.totalPrice || space.price || 0).toLocaleString("en-IN")}`;
    const imageUri =
      Array.isArray(space.images) && space.images.length > 0
        ? space.images[0]
        : "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=60";

    const isUpdating = actionLoadingId === item._id;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.92}
        onPress={() => setSelectedBooking(item)}
      >
        {/* Header: Buyer info & status badge */}
        <View style={styles.cardHeader}>
          <View style={styles.buyerAvatarBg}>
            <Ionicons name="person-outline" size={18} color={colors.primary} />
          </View>

          <View style={styles.buyerInfo}>
            <Text style={styles.buyerLabel}>CAMPAIGN REQUEST BUYER</Text>
            <Text style={styles.buyerName} numberOfLines={1}>
              {buyerName}
            </Text>
            {buyer.email ? (
              <Text style={styles.buyerContact} numberOfLines={1}>
                {buyer.email} {buyer.mobile ? `• ${buyer.mobile}` : ""}
              </Text>
            ) : null}
          </View>

          <StatusBadge status={item.status} />
        </View>

        <View style={styles.divider} />

        {/* Ad Space detail summary */}
        <View style={styles.cardBody}>
          <View style={styles.adRow}>
            <Image source={{ uri: imageUri }} style={styles.adThumb} />
            <View style={styles.adDetails}>
              <Text style={styles.adName} numberOfLines={1}>
                {space.title || "Advertisement Space"}
              </Text>
              <View style={styles.categoryRow}>
                <Ionicons name="pricetag-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.categoryText}>{space.category || "Media Space"}</Text>
                {space.location?.city ? (
                  <Text style={styles.locationText}> • {space.location.city}</Text>
                ) : null}
              </View>
            </View>
          </View>

          {item.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Buyer Notes:</Text>
              <Text style={styles.notesText} numberOfLines={2}>
                "{item.notes}"
              </Text>
            </View>
          ) : null}

          {/* Key details grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Duration Period</Text>
              <Text style={styles.detailValue}>
                {formatDate(item.startDate)} – {formatDate(item.endDate)}
              </Text>
            </View>

            <View style={[styles.detailCol, styles.detailColRight]}>
              <Text style={styles.detailLabel}>Total Budget</Text>
              <Text style={styles.budgetValue}>{priceFormatted}</Text>
            </View>
          </View>
        </View>

        {/* Actions for Pending Requests */}
        {statusKey === "pending" && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.rejectBtn}
              activeOpacity={0.8}
              disabled={isUpdating}
              onPress={() => handleUpdateStatus(item._id, "Cancelled", buyerName)}
            >
              <Text style={styles.rejectBtnText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptBtn}
              activeOpacity={0.8}
              disabled={isUpdating}
              onPress={() => handleUpdateStatus(item._id, "Active", buyerName)}
            >
              <Text style={styles.acceptBtnText}>Accept Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campaign Bookings</Text>
        <Text style={styles.headerSubtitle}>
          Review and manage incoming buyer advertising requests
        </Text>
      </View>

      {/* ── Tabs ── */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsTrack}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, isActive && styles.activeTabBtn]}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab} {isActive && pagination?.total != null ? `(${pagination.total})` : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Content List ── */}
      {loading && !refreshing ? (
        <View style={{ paddingHorizontal: 20 }}>
          <SkeletonCard type="card" count={3} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id || String(Math.random())}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 16 }} />
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No bookings found"
              description={`You don't have any ${activeTab.toLowerCase()} campaign bookings at the moment.`}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
            />
          }
          renderItem={renderItem}
        />
      )}

      {/* ── Detail Modal ── */}
      <BookingDetailModal
        visible={Boolean(selectedBooking)}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onAccept={(id, buyerName) => handleUpdateStatus(id, "Active", buyerName)}
        onDecline={(id, buyerName) => handleUpdateStatus(id, "Cancelled", buyerName)}
        isUpdating={Boolean(actionLoadingId)}
      />

      {/* ── Feedback Modal ── */}
      <FeedbackModal {...modalConfig} />
    </View>
  );
};

export default BookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : hp("6%"),
  },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },

  tabsWrapper: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tabsTrack: {
    flexDirection: "row",
    backgroundColor: colors.divider,
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabBtn: {
    backgroundColor: colors.white,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: hp("15%"),
    gap: 14,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buyerAvatarBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  buyerInfo: {
    flex: 1,
  },
  buyerLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  buyerName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.1,
  },
  buyerContact: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 14,
  },

  cardBody: {
    gap: 10,
  },
  adRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  adThumb: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.divider,
  },
  adDetails: {
    flex: 1,
  },
  adName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.1,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  locationText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  notesBox: {
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 2,
  },
  notesText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontStyle: "italic",
  },
  detailsGrid: {
    flexDirection: "row",
    marginTop: 4,
    gap: 16,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
  },
  detailCol: {
    flex: 1,
  },
  detailColRight: {
    alignItems: "flex-end",
  },
  detailLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  budgetValue: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 15,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  rejectBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectBtnText: {
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
  acceptBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
  },
});
