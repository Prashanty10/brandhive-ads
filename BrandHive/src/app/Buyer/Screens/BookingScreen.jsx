import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import colors from "../../../Theme/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  getBuyerBookingsApi,
  createBookingApi,
  cancelBookingApi,
  getAdSpaceDetailApi,
} from "../Api/adspaceApi";
import FeedbackModal from "../components/common/FeedbackModal";
import usePaginatedList from "../components/common/usePaginatedList";
import { RefreshControl } from "react-native";

const TABS = ["Active", "Pending", "Completed", "Cancelled"];

const STATUS_CONFIG = {
  Active: { color: "#059669", bg: "#ECFDF5" },
  Pending: { color: "#F59E0B", bg: "#FFFBEB" },
  Completed: { color: "#2563EB", bg: "#EFF6FF" },
  Cancelled: { color: "#EF4444", bg: "#FEF2F2" },
};

const BookingScreen = () => {
  const router = useRouter();
  const { adspaceId } = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState("Active");

  // Feedback Modal state
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
    details: null,
    primaryBtnText: "OK",
    onPrimaryPress: null,
  });

  // New Booking Modal state if adspaceId passed
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [adspace, setAdspace] = useState(null);
  const [loadingAd, setLoadingAd] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [durationDays, setDurationDays] = useState("30");
  const [bookingNotes, setBookingNotes] = useState("");

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
  } = usePaginatedList(getBuyerBookingsApi, filters, 20);

  useEffect(() => {
    loadPage(1);
  }, [activeTab]);

  // If adspaceId parameter is present, fetch ad details and open booking modal
  useEffect(() => {
    if (adspaceId) {
      (async () => {
        try {
          setLoadingAd(true);
          const res = await getAdSpaceDetailApi(adspaceId);
          if (res?.success && res.data) {
            setAdspace(res.data);
            setBookingModalVisible(true);
          }
        } catch (err) {
          Alert.alert("Error", "Could not load ad space details for booking.");
        } finally {
          setLoadingAd(false);
        }
      })();
    }
  }, [adspaceId]);

  const handleConfirmBooking = async () => {
    if (!adspace) return;

    try {
      setSubmittingBooking(true);
      const days = Number(durationDays) || 30;
      const startDate = new Date();
      const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      const res = await createBookingApi({
        adspaceID: adspace._id || adspaceId,
        startDate,
        endDate,
        notes: bookingNotes.trim(),
      });

      if (res?.success) {
        setBookingModalVisible(false);
        setModalConfig({
          visible: true,
          type: "success",
          title: "Booking Submitted! 🎉",
          message: "Your advertising campaign booking request has been submitted to the seller.",
          details: {
            Space: adspace.title || "Advertisement Space",
            Duration: `${days} Days`,
            "Total Price": `₹${Number(res.data?.totalPrice || adspace.price || 0).toLocaleString("en-IN")}`,
            Status: res.data?.status || "Pending",
          },
          primaryBtnText: "View My Bookings",
          onPrimaryPress: () => {
            setModalConfig((prev) => ({ ...prev, visible: false }));
            fetchBookings();
          },
        });
      }
    } catch (err) {
      setModalConfig({
        visible: true,
        type: "error",
        title: "Booking Failed ⚠️",
        message: err.message || "Failed to confirm booking. Please try again.",
        primaryBtnText: "Try Again",
        onPrimaryPress: () => setModalConfig((prev) => ({ ...prev, visible: false })),
      });
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleCancelBooking = (bookingItem) => {
    const title = bookingItem.adspaceID?.title || "this space";
    Alert.alert(
      "Cancel Booking",
      `Are you sure you want to cancel your booking for "${title}"?`,
      [
        { text: "Keep Booking", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await cancelBookingApi(bookingItem._id);
              if (res?.success) {
                setBookings((prev) =>
                  prev.map((b) =>
                    b._id === bookingItem._id ? { ...b, status: "Cancelled" } : b
                  )
                );
                setModalConfig({
                  visible: true,
                  type: "warning",
                  title: "Booking Cancelled",
                  message: `Your booking for "${title}" has been cancelled.`,
                  primaryBtnText: "OK",
                  onPrimaryPress: () => setModalConfig((prev) => ({ ...prev, visible: false })),
                });
              }
            } catch (err) {
              setModalConfig({
                visible: true,
                type: "error",
                title: "Cancellation Failed ⚠️",
                message: err.message || "Unable to cancel booking.",
                primaryBtnText: "OK",
                onPrimaryPress: () => setModalConfig((prev) => ({ ...prev, visible: false })),
              });
            }
          },
        },
      ]
    );
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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="calendar-outline" size={28} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No bookings here</Text>
      <Text style={styles.emptySubtitle}>
        {`Your ${activeTab.toLowerCase()} bookings will appear here once booked.`}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const statusKey = item.status || "Active";
    const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.Active;
    const space = item.adspaceID || {};
    const seller = item.sellerID || {};

    const imageUri =
      Array.isArray(space.images) && space.images.length > 0
        ? space.images[0]
        : "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=60";

    const sellerName = seller.firstName
      ? `${seller.firstName} ${seller.lastName || ""}`.trim()
      : "Verified Media Seller";

    const priceFormatted = `₹${Number(item.totalPrice || space.price || 0).toLocaleString("en-IN")}`;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.92}
        onPress={() => {
          if (space._id) {
            router.push({
              pathname: "/Buyer/Screens/AdvertisementDetailsScreen",
              params: { id: space._id },
            });
          }
        }}
      >
        <View style={styles.cardTop}>
          <Image source={{ uri: imageUri }} style={styles.iconBlock} />
          <View style={styles.cardTitleGroup}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {space.title || "Advertisement Space"}
            </Text>
            <Text style={styles.cardSeller} numberOfLines={1}>
              Seller: {sellerName}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.statusText, { color: cfg.color }]}>
              {statusKey}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <View style={styles.detailLabelRow}>
              <Ionicons name="grid-outline" size={11} color={colors.primary} />
              <Text style={styles.detailLabel}>Category</Text>
            </View>
            <Text style={styles.detailValue}>{space.category || "Billboard"}</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabelRow}>
              <Ionicons name="calendar-outline" size={11} color="#059669" />
              <Text style={styles.detailLabel}>Duration</Text>
            </View>
            <Text style={styles.detailValue}>
              {formatDate(item.startDate)} – {formatDate(item.endDate)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabelRow}>
              <Ionicons name="wallet-outline" size={11} color="#D97706" />
              <Text style={styles.detailLabel}>Total Amount</Text>
            </View>
            <Text style={[styles.detailValue, styles.priceValue]}>{priceFormatted}</Text>
          </View>
        </View>

        {/* Actions */}
        {statusKey === "Active" && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancelBooking(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancel Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.viewBtn}
              activeOpacity={0.8}
              onPress={() => {
                if (space._id) {
                  router.push({
                    pathname: "/Buyer/Screens/AdvertisementDetailsScreen",
                    params: { id: space._id },
                  });
                }
              }}
            >
              <Text style={styles.viewBtnText}>View Space</Text>
            </TouchableOpacity>
          </View>
        )}

        {statusKey === "Pending" && (
          <View style={styles.pendingNote}>
            <Ionicons name="time-outline" size={13} color="#F59E0B" />
            <Text style={styles.pendingNoteText}>Awaiting seller confirmation</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Track your active advertisement campaigns</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsTrack}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, isActive && styles.activeTabBtn]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab} {isActive && pagination?.total != null ? `(${pagination.total})` : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* List */}
      {loading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching your bookings...</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 16 }} />
            ) : null
          }
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}

      {/* New Booking Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bookingModalVisible}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Booking</Text>
              <TouchableOpacity
                onPress={() => setBookingModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {loadingAd ? (
              <View style={{ padding: 40, alignItems: "center" }}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : adspace ? (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScroll}>
                <View style={styles.adSummaryBox}>
                  <Text style={styles.summaryTitle}>{adspace.title}</Text>
                  <Text style={styles.summarySub}>
                    Category: {adspace.category} • Location: {adspace.location?.city || "Available"}
                  </Text>
                  <Text style={styles.summaryPrice}>
                    Price: ₹{Number(adspace.price || 0).toLocaleString("en-IN")} / {adspace.priceUnit || "month"}
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Campaign Duration (Days)</Text>
                  <TextInput
                    style={styles.input}
                    value={durationDays}
                    onChangeText={setDurationDays}
                    keyboardType="numeric"
                    placeholder="30"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Campaign Notes / Special Requests</Text>
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={bookingNotes}
                    onChangeText={setBookingNotes}
                    placeholder="Enter branding notes or artwork instructions..."
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.confirmBtn, submittingBooking && { opacity: 0.6 }]}
                  activeOpacity={0.88}
                  onPress={handleConfirmBooking}
                  disabled={submittingBooking}
                >
                  {submittingBooking ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.confirmBtnText}>Confirm & Book Now</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
      <FeedbackModal {...modalConfig} />
    </SafeAreaView>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },
  tabsWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  tabsTrack: {
    flexDirection: "row",
    backgroundColor: colors.divider,
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabBtn: {
    backgroundColor: colors.white,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textPrimary,
  },
  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: hp("15%"),
    gap: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBlock: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  cardTitleGroup: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  cardSeller: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 14,
  },
  detailGrid: {
    gap: 10,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  priceValue: {
    fontWeight: "800",
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  cancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  viewBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  pendingNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pendingNoteText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F59E0B",
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: hp("10%"),
    paddingHorizontal: 40,
  },
  emptyIconBg: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: colors.divider,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: hp("70%"),
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
  },
  formScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: hp("5%"),
    gap: 14,
  },
  adSummaryBox: {
    backgroundColor: colors.neutralLight,
    padding: 14,
    borderRadius: 14,
    gap: 4,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  summarySub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 4,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
  },
  multilineInput: {
    height: 70,
    paddingVertical: 10,
    textAlignVertical: "top",
  },
  confirmBtn: {
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  confirmBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
