import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Modal,
  ScrollView,
  RefreshControl,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../Theme/colors";
import { OFFLINE_AD_CATEGORIES } from "../../Buyer/advertisement/offline/OfflineCategoryScreen";
import {
  getMyAdvertisementsApi,
  updateAdSpaceApi,
  toggleAdSpaceStatusApi,
  deleteAdSpaceApi,
} from "../../Buyer/Api/adspaceApi";
import usePaginatedList from "../../Buyer/components/common/usePaginatedList";
import StatusBadge from "../components/StatusBadge";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=60";

const FILTER_OPTIONS = ["All", "Active", "Pending", "Inactive"];

const AdvertisementsScreen = () => {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const filters = React.useMemo(
    () => ({
      status: activeFilter !== "All" ? activeFilter.toLowerCase() : undefined,
      q: searchQuery.trim() || undefined,
    }),
    [activeFilter, searchQuery]
  );

  const {
    data: advertisements,
    pagination,
    isLoading: loading,
    isLoadingMore,
    isRefreshing: refreshing,
    loadPage,
    refresh,
    loadMore,
    setData: setAdvertisements,
  } = usePaginatedList(getMyAdvertisementsApi, filters, 20);

  useFocusEffect(
    useCallback(() => {
      loadPage(1);
    }, [filters])
  );

  const handleCategorySelect = (categoryName) => {
    setCategoryModalVisible(false);
    router.push({
      pathname: "/Seller/CreateAdvertisement",
      params: { categoryName },
    });
  };

  const handleOpenEdit = (adItem) => {
    setEditingAd(adItem);
    setEditTitle(adItem.title || "");
    setEditPrice(adItem.price ? String(adItem.price) : "");
    const address =
      typeof adItem.location === "object" && adItem.location?.address
        ? adItem.location.address
        : typeof adItem.location === "string"
        ? adItem.location
        : "";
    setEditAddress(address);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      Alert.alert("Validation", "Please enter an advertisement title.");
      return;
    }
    if (!editPrice.trim() || isNaN(Number(editPrice)) || Number(editPrice) < 0) {
      Alert.alert("Validation", "Please enter a valid non-negative price.");
      return;
    }

    try {
      setSavingEdit(true);
      const res = await updateAdSpaceApi(editingAd._id, {
        title: editTitle.trim(),
        price: Number(editPrice),
        location: {
          ...editingAd.location,
          address: editAddress.trim(),
        },
      });

      if (res?.success) {
        setAdvertisements((prev) =>
          prev.map((item) => (item._id === editingAd._id ? res.data : item))
        );
        setEditModalVisible(false);
        setEditingAd(null);
        Alert.alert("Success 🎉", "Ad space details updated successfully!");
      }
    } catch (err) {
      Alert.alert("Update Failed", err.message || "Unable to save changes.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleStatus = async (adItem) => {
    const currentStatus = adItem.status || "active";
    const nextStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const res = await toggleAdSpaceStatusApi(adItem._id, nextStatus);
      if (res?.success) {
        setAdvertisements((prev) =>
          prev.map((item) =>
            item._id === adItem._id ? { ...item, status: nextStatus } : item
          )
        );
      }
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to toggle status.");
    }
  };

  const handleDeleteAdSpace = (adItem) => {
    Alert.alert(
      "Delete Advertisement Space",
      `Are you sure you want to delete "${adItem.title || "this ad space"}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deleteAdSpaceApi(adItem._id);
              if (res?.success) {
                setAdvertisements((prev) =>
                  prev.filter((item) => item._id !== adItem._id)
                );
                Alert.alert("Deleted 🎉", "Ad space listing deleted successfully.");
              }
            } catch (err) {
              Alert.alert("Delete Failed", err?.message || "Failed to delete ad space.");
            }
          },
        },
      ]
    );
  };

  const formatPrice = (price) => {
    if (price == null) return "N/A";
    const num = Number(price);
    if (isNaN(num)) return price;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const getCategoryDetails = (catName) => {
    const matched = OFFLINE_AD_CATEGORIES?.find(
      (c) => c.categoryName === catName
    );
    if (matched) {
      return {
        title: matched.title,
        icon: matched.icon[0] || "easel-outline",
        iconColor: matched.iconColor || colors.primary,
      };
    }
    const formatted = catName
      ? catName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : "General Ad";
    return {
      title: formatted,
      icon: "easel-outline",
      iconColor: colors.primary,
    };
  };

  const filteredAdvertisements = advertisements.filter((item) => {
    const matchesFilter =
      activeFilter === "All" ||
      (item.status || "active").toLowerCase() === activeFilter.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (item.title || "").toLowerCase().includes(q) ||
      (item.category || "").toLowerCase().includes(q) ||
      (item.location?.city || "").toLowerCase().includes(q) ||
      (item.location?.address || "").toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const renderAdCard = ({ item }) => {
    const catDetails = getCategoryDetails(item.category);
    const imageUri =
      Array.isArray(item.images) && item.images.length > 0 && item.images[0]?.startsWith("http")
        ? item.images[0]
        : DEFAULT_IMAGE;

    const locationText =
      item.location?.city
        ? `${item.location.city}${item.location.state ? `, ${item.location.state}` : ""}`
        : item.location?.address || "Location specified";

    const isVerified = Boolean(item.isVerified || item.sellerVerification);

    return (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <Image source={{ uri: imageUri }} style={styles.cardImage} resizeMode="cover" />

          <View style={styles.cardHeaderInfo}>
            <View style={styles.badgeRow}>
              <StatusBadge status={item.status} />

              {isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#059669" />
                  <Text style={styles.verifiedBadgeText}>Verified</Text>
                </View>
              )}
            </View>

            <Text style={styles.adTitle} numberOfLines={1}>
              {item.title}
            </Text>

            <View style={styles.categoryRow}>
              <Ionicons name={catDetails.icon} size={12} color={catDetails.iconColor} />
              <Text style={styles.categoryText}>{catDetails.title}</Text>
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color="#EF4444" />
              <Text style={styles.locationText} numberOfLines={1}>
                {locationText}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>{formatPrice(item.price)}</Text>
              <Text style={styles.priceDuration}> / {item.priceUnit || "month"}</Text>
            </View>
          </View>
        </View>

        {/* Stats bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={13} color="#2563EB" />
            <Text style={styles.statText}>{item.views || 0} views</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={13} color="#059669" />
            <Text style={styles.statText}>{item.bookings || 0} bookings</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons
              name={item.availability?.isAvailable !== false ? "checkmark-circle-outline" : "close-circle-outline"}
              size={13}
              color={item.availability?.isAvailable !== false ? "#10B981" : "#EF4444"}
            />
            <Text style={styles.statText}>
              {item.availability?.isAvailable !== false ? "Available" : "Booked"}
            </Text>
          </View>
        </View>

        {/* Actions bar */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() =>
              router.push({
                pathname: "/Buyer/Screens/AdvertisementDetailsScreen",
                params: { id: item._id },
              })
            }
          >
            <Ionicons name="open-outline" size={13} color={colors.textPrimary} />
            <Text style={styles.actionBtnText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleOpenEdit(item)}
          >
            <Ionicons name="create-outline" size={13} color={colors.primary} />
            <Text style={[styles.actionBtnText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              item.status === "active" ? styles.deactivateBtn : styles.activateBtn,
            ]}
            onPress={() => handleToggleStatus(item)}
          >
            <Ionicons
              name={item.status === "active" ? "pause-circle-outline" : "play-circle-outline"}
              size={13}
              color={item.status === "active" ? "#D97706" : "#10B981"}
            />
            <Text
              style={[
                styles.actionBtnText,
                { color: item.status === "active" ? "#D97706" : "#10B981" },
              ]}
            >
              {item.status === "active" ? "Pause" : "Activate"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDeleteAdSpace(item)}
          >
            <Ionicons name="trash-outline" size={13} color="#DC2626" />
            <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Advertisements</Text>
          <Text style={styles.headerSubtitle}>
            Manage & edit your listed advertising spaces
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerAddBtn}
          activeOpacity={0.8}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.headerAddBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search & Filter Toolbar ── */}
      <View style={styles.toolbar}>
        {/* Search input */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ad spaces by title, city..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipRow}
        >
          {FILTER_OPTIONS.map((f) => {
            const isSel = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, isSel && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterChipText, isSel && styles.filterChipTextActive]}>
                  {f} {isSel && pagination?.total != null ? `(${pagination.total})` : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Content List ── */}
      {loading && !refreshing ? (
        <View style={{ paddingHorizontal: 20 }}>
          <SkeletonCard type="card" count={3} />
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={advertisements}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderAdCard}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 16 }} />
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="easel-outline"
              title="No advertisement spaces found"
              description={
                searchQuery
                  ? "No listings match your search criteria."
                  : `You don't have any ${activeFilter.toLowerCase()} advertisement spaces.`
              }
              buttonTitle="+ Add Advertisement Space"
              onButtonPress={() => setCategoryModalVisible(true)}
            />
          }
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

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Advertisement</Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScroll}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Enter title..."
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price (₹ / Month)</Text>
                <TextInput
                  style={styles.input}
                  value={editPrice}
                  onChangeText={setEditPrice}
                  placeholder="Enter price..."
                  keyboardType="numeric"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location Address</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={editAddress}
                  onChangeText={setEditAddress}
                  placeholder="Enter location address..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveEditBtn, savingEdit && { opacity: 0.6 }]}
                activeOpacity={0.88}
                onPress={handleSaveEdit}
                disabled={savingEdit}
              >
                {savingEdit ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.saveEditBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Category Select Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Advertising Medium</Text>
              <TouchableOpacity
                onPress={() => setCategoryModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}
            >
              <Text style={styles.modalSubtitle}>
                Select a medium to list your new advertisement space:
              </Text>
              {OFFLINE_AD_CATEGORIES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.categoryItem}
                  activeOpacity={0.7}
                  onPress={() => handleCategorySelect(item.categoryName)}
                >
                  <View
                    style={[
                      styles.itemIconContainer,
                      { backgroundColor: `${item.color || colors.primary}15` },
                    ]}
                  >
                    <Ionicons
                      name={item.icon || "easel-outline"}
                      size={20}
                      color={item.color || colors.primary}
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSubtitle} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdvertisementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : hp("6%"),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
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
    marginTop: 2,
  },
  headerAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.button,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerAddBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },

  // Toolbar
  toolbar: {
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  filterChipRow: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
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
    padding: 14,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 12,
  },
  cardTopRow: {
    flexDirection: "row",
    gap: 12,
  },
  cardImage: {
    width: wp("28%"),
    height: wp("28%"),
    borderRadius: 14,
  },
  cardHeaderInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
  },
  adTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceValue: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  priceDuration: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.neutralLight,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: colors.border,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 6,
    paddingTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 4,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  deactivateBtn: {
    borderColor: "#FEF3C7",
    backgroundColor: "#FFFBEB",
  },
  activateBtn: {
    borderColor: "#D1FAE5",
    backgroundColor: "#ECFDF5",
  },
  deleteBtn: {
    borderColor: "#FEE2E2",
    backgroundColor: "#FEF2F2",
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
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
  formScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
  },
  multilineInput: {
    height: 70,
    paddingTop: 10,
    textAlignVertical: "top",
  },
  saveEditBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.button,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  saveEditBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },

  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 10,
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    gap: 12,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  itemSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
