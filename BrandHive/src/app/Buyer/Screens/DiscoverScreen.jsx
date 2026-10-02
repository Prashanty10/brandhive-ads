import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Modal,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "../../../Theme/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { searchAdSpacesApi } from "../Api/adspaceApi";
import AdvertisementSpaceCard from "../components/Home/AdvertisementSpaceCard";
import usePaginatedList from "../components/common/usePaginatedList";
import { RefreshControl } from "react-native";

const CATEGORIES = [
  { id: "all", label: "All Spaces", icon: "grid-outline" },
  { id: "hoarding", label: "Billboards", icon: "easel-outline" },
  { id: "digital_billboard", label: "Digital LED", icon: "tv-outline" },
  { id: "bus_advertisement", label: "Transit & Bus", icon: "bus-outline" },
  { id: "auto_advertisement", label: "Auto & Cab", icon: "car-outline" },
  { id: "metro_advertisement", label: "Metro Ads", icon: "subway-outline" },
  { id: "mall_advertisement", label: "Mall Banners", icon: "storefront-outline" },
  { id: "airport_advertisement", label: "Airport Displays", icon: "airplane-outline" },
  { id: "online_banner", label: "Online Banners", icon: "globe-outline" },
  { id: "social_media", label: "Social Media", icon: "share-social-outline" },
];

const DiscoverScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState(params.q || "");
  const [debouncedQuery, setDebouncedQuery] = useState(params.q || "");
  const [activeCategory, setActiveCategory] = useState(params.category || "all");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Advanced Filter State
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [bookingTypeFilter, setBookingTypeFilter] = useState("all");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filters = React.useMemo(() => {
    const qParams = {};
    if (debouncedQuery.trim()) qParams.q = debouncedQuery.trim();
    if (activeCategory && activeCategory !== "all") qParams.category = activeCategory;
    if (priceMin) qParams.minPrice = priceMin;
    if (priceMax) qParams.maxPrice = priceMax;
    if (verifiedOnly) qParams.isVerified = "true";
    if (availableOnly) qParams.availableNow = "true";
    if (bookingTypeFilter !== "all") qParams.bookingType = bookingTypeFilter;
    return qParams;
  }, [debouncedQuery, activeCategory, priceMin, priceMax, verifiedOnly, availableOnly, bookingTypeFilter]);

  const {
    data: spaces,
    pagination,
    isLoading: loading,
    isLoadingMore,
    isRefreshing: refreshing,
    loadPage,
    refresh,
    loadMore,
  } = usePaginatedList(searchAdSpacesApi, filters, 20);

  useEffect(() => {
    loadPage(1);
  }, [filters]);

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
    loadPage(1);
  };

  const handleResetFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setVerifiedOnly(false);
    setAvailableOnly(false);
    setBookingTypeFilter("all");
    setFilterModalVisible(false);
  };

  const hasActiveFilters = Boolean(
    priceMin || priceMax || verifiedOnly || availableOnly || bookingTypeFilter !== "all"
  );

  const currentCategoryObj = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── 1. Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>
            Browse & book verified advertising spaces
          </Text>
        </View>

        <TouchableOpacity
          style={styles.filterBtn}
          activeOpacity={0.8}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={19} color={colors.textPrimary} />
          {hasActiveFilters && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* ── 2. Search Input Bar ── */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={17} color={colors.textPrimary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search billboards, cities, types..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── 3. Styled Category Options Pills ── */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isActive && styles.activeChip]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={cat.icon}
                  size={15}
                  color={isActive ? colors.white : colors.textSecondary}
                />
                <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── 4. Results Header Summary Bar ── */}
      <View style={styles.resultsSummaryRow}>
        <Text style={styles.resultsCountText}>
          {loading && !refreshing
            ? "Searching..."
            : `${pagination?.total ?? spaces.length} ${(pagination?.total ?? spaces.length) === 1 ? "space" : "spaces"} found`}
        </Text>
        {activeCategory !== "all" && (
          <TouchableOpacity
            style={styles.clearCategoryPill}
            onPress={() => setActiveCategory("all")}
          >
            <Text style={styles.clearCategoryText}>Category: {currentCategoryObj.label}</Text>
            <Ionicons name="close" size={12} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── 5. Results List ── */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching advertisement spaces...</Text>
        </View>
      ) : (
        <FlatList
          data={spaces}
          keyExtractor={(item) => item._id || item.id || String(Math.random())}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 16 }} />
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <AdvertisementSpaceCard item={item} cardWidth={wp("90%")} />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="search-outline" size={30} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No advertisement spaces found</Text>
              <Text style={styles.emptySubtitle}>
                {`No ${currentCategoryObj.label.toLowerCase()} match your search query. Try switching category or resetting filters.`}
              </Text>
              {(searchQuery || activeCategory !== "all" || hasActiveFilters) && (
                <TouchableOpacity
                  style={styles.resetAllBtn}
                  onPress={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                    handleResetFilters();
                  }}
                >
                  <Text style={styles.resetAllBtnText}>Show All Spaces</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}

      {/* ── 6. Advanced Filter Modal ── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Ad Spaces</Text>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScroll}>
              {/* Price Range */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price Range (₹ / month)</Text>
                <View style={styles.priceInputsRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Min price"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={priceMin}
                    onChangeText={setPriceMin}
                  />
                  <Text style={styles.toText}>to</Text>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Max price"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={priceMax}
                    onChangeText={setPriceMax}
                  />
                </View>
              </View>

              {/* Verified Seller Toggle */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Seller Verification</Text>
                <TouchableOpacity
                  style={[styles.toggleBtn, verifiedOnly && styles.toggleBtnActive]}
                  onPress={() => setVerifiedOnly(!verifiedOnly)}
                >
                  <Ionicons
                    name={verifiedOnly ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={verifiedOnly ? colors.primary : colors.textMuted}
                  />
                  <Text style={styles.toggleBtnText}>Verified Sellers Only</Text>
                </TouchableOpacity>
              </View>

              {/* Availability Toggle */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Availability</Text>
                <TouchableOpacity
                  style={[styles.toggleBtn, availableOnly && styles.toggleBtnActive]}
                  onPress={() => setAvailableOnly(!availableOnly)}
                >
                  <Ionicons
                    name={availableOnly ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={availableOnly ? colors.primary : colors.textMuted}
                  />
                  <Text style={styles.toggleBtnText}>Available Today Only</Text>
                </TouchableOpacity>
              </View>

              {/* Booking Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Booking Type</Text>
                <View style={styles.bookingTypeRow}>
                  {["all", "Instant Booking", "Request Approval"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.bookingChip,
                        bookingTypeFilter === type && styles.bookingChipActive,
                      ]}
                      onPress={() => setBookingTypeFilter(type)}
                    >
                      <Text
                        style={[
                          styles.bookingChipText,
                          bookingTypeFilter === type && styles.bookingChipTextActive,
                        ]}
                      >
                        {type === "all" ? "All Types" : type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Filter Actions */}
              <View style={styles.filterActionsRow}>
                <TouchableOpacity style={styles.resetBtn} onPress={handleResetFilters}>
                  <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.applyBtn} onPress={handleApplyFilters}>
                  <Text style={styles.applyBtnText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 10 : 6,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary,
  },

  // ── Search Input
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 20,
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 50,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    height: "100%",
    paddingVertical: 0,
  },

  // ── Category Option Chips
  categoriesSection: {
    marginBottom: 10,
  },
  categoriesRow: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  activeChipText: {
    color: colors.white,
    fontWeight: "700",
  },

  // ── Results Summary Bar
  resultsSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  resultsCountText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  clearCategoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  clearCategoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },

  // ── Loading & Results List
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingTop: hp("10%"),
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: hp("15%"),
  },
  cardWrapper: {
    marginBottom: 16,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: hp("8%"),
    paddingHorizontal: 30,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
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
    marginTop: 6,
    lineHeight: 18,
  },
  resetAllBtn: {
    marginTop: 18,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetAllBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: hp("72%"),
    paddingTop: 18,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
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
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  priceInputsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  toggleBtnActive: {
    borderColor: colors.primary,
    backgroundColor: "#EFF6FF",
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  bookingTypeRow: {
    flexDirection: "row",
    gap: 8,
  },
  bookingChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  bookingChipActive: {
    borderColor: colors.primary,
    backgroundColor: "#EFF6FF",
  },
  bookingChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  bookingChipTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  filterActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  applyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
});
