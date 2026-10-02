import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../Theme/colors";

export const OFFLINE_AD_CATEGORIES = [
  {
    id: 1,
    categoryName: "hoarding",
    title: "Hoarding",
    subtitle: "Traditional Outdoor Unipole & Billboard",
    icon: ["easel-outline"],
    iconColor: "#0284C7",
  },
  {
    id: 2,
    categoryName: "digital_billboard",
    title: "Digital Billboard",
    subtitle: "High-Def 4K Outdoor LED Screens",
    icon: ["tv-outline"],
    iconColor: "#7C3AED",
  },
  {
    id: 3,
    categoryName: "led_screen",
    title: "LED Screen",
    subtitle: "Commercial & Retail Standee Displays",
    icon: ["desktop-outline"],
    iconColor: "#2563EB",
  },
  {
    id: 4,
    categoryName: "bus_advertisement",
    title: "Bus Advertisement",
    subtitle: "City Public Transit Full Body & Panel Wraps",
    icon: ["bus-outline"],
    iconColor: "#059669",
  },
  {
    id: 5,
    categoryName: "bus_shelter_advertisement",
    title: "Bus Shelter Advertisement",
    subtitle: "Lit Commuter Banners & Both-Side Panels",
    icon: ["business-outline"],
    iconColor: "#EA580C",
  },
  {
    id: 6,
    categoryName: "auto_rickshaw_advertisement",
    title: "Auto Rickshaw Advertisement",
    subtitle: "Mobile Hood Covers & Driver Backseat Posters",
    icon: ["car-outline"],
    iconColor: "#D97706",
  },
  {
    id: 7,
    categoryName: "taxi_advertisement",
    title: "Taxi Advertisement",
    subtitle: "Uber / Ola Cab Carrier & Glass Branding",
    icon: ["car-sport-outline"],
    iconColor: "#0284C7",
  },
  {
    id: 8,
    categoryName: "van_advertisement",
    title: "Van Advertisement",
    subtitle: "Mobile Display Van with Sound & LED",
    icon: ["bus-outline"],
    iconColor: "#16A34A",
  },
  {
    id: 9,
    categoryName: "truck_advertisement",
    title: "Truck Advertisement",
    subtitle: "Intercity Highway Cargo Container Body Wrap",
    icon: ["car-outline"],
    iconColor: "#475569",
  },
  {
    id: 10,
    categoryName: "metro_advertisement",
    title: "Metro Advertisement",
    subtitle: "Train Exterior Wraps & Station Media",
    icon: ["subway-outline"],
    iconColor: "#7C3AED",
  },
  {
    id: 11,
    categoryName: "local_train_advertisement",
    title: "Local Train Advertisement",
    subtitle: "Overhead Posters & Coach Interior Branding",
    icon: ["train-outline"],
    iconColor: "#2563EB",
  },
  {
    id: 12,
    categoryName: "railway_station_advertisement",
    title: "Railway Station Advertisement",
    subtitle: "FOB Bridge Banners, Platform Screens & Kiosks",
    icon: ["location-outline"],
    iconColor: "#D97706",
  },
  {
    id: 13,
    categoryName: "airport_advertisement",
    title: "Airport Advertisement",
    subtitle: "Terminal Screens, Conveyor Belts & Trolleys",
    icon: ["airplane-outline"],
    iconColor: "#0284C7",
  },
  {
    id: 14,
    categoryName: "mall_advertisement",
    title: "Mall Advertisement",
    subtitle: "Atrium Drop Banners, Escalators & Digital Standees",
    icon: ["storefront-outline"],
    iconColor: "#EC4899",
  },
];

const offlinePlatforms = OFFLINE_AD_CATEGORIES.map((item) => {
  return {
    id: item.id,
    name: item.title,
    categoryName: item.categoryName,
    icon: Array.isArray(item.icon) ? item.icon[0] : item.icon,
    iconColor: item.iconColor,
    bgTint: "#E0F2FE",
    subtitle: item.subtitle,
  };
});

const OfflineCategoryScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlatforms = offlinePlatforms.filter((platform) => {
    return (
      platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handlePlatformPress = (item) => {
    router.push({
      pathname: "/Buyer/Screens/DiscoverScreen",
      params: { category: item.categoryName },
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={wp("12%")} color={colors.textMuted} />
      <Text style={styles.emptyTitle}>No platforms found</Text>
      <Text style={styles.emptySubtitle}>
        {`We couldn't find any advertising platforms matching "${searchQuery}"`}
      </Text>
      <TouchableOpacity
        style={styles.clearSearchBtn}
        onPress={() => setSearchQuery("")}
      >
        <Text style={styles.clearSearchText}>Reset Filter</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Offline Ads</Text>
          <Text style={styles.headerSubtitle}>Discover premium offline advertising spaces</Text>
        </View>
        <View style={{ width: wp("10%") }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={18}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search platforms..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Platforms Grid List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredPlatforms}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => handlePlatformPress(item)}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.cardTopRow}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: item.bgTint },
                    ]}
                  >
                    <Ionicons name={item.icon} size={22} color={item.iconColor} />
                  </View>
                </View>

                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text
                  style={styles.cardSubtitle}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.subtitle}
                </Text>
              </View>

              <View style={styles.learnMoreContainer}>
                <Text style={styles.learnMoreText}>Learn more</Text>
                <Ionicons
                  name="chevron-forward"
                  size={12}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default OfflineCategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : hp("6%"),
  },
  header: {
    height: hp("7%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    backgroundColor: colors.background,
  },
  backButton: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  headerTitleContainer: {
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: wp("2.8%"),
    color: colors.textSecondary,
    marginTop: 1,
  },
  searchRow: {
    paddingHorizontal: wp("5%"),
    marginTop: hp("1.5%"),
    marginBottom: hp("1%"),
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: wp("3%"),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  searchIcon: {
    marginRight: wp("2%"),
  },
  searchInput: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    color: colors.textPrimary,
    fontSize: wp("3.8%"),
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("12%"),
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: hp("2%"),
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("4%"),
    width: wp("43.5%"),
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: "space-between",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp("1.2%"),
  },
  iconContainer: {
    width: wp("11%"),
    height: wp("11%"),
    borderRadius: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: wp("3.8%"),
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: hp("0.5%"),
  },
  cardSubtitle: {
    fontSize: wp("3%"),
    color: colors.textSecondary,
    lineHeight: wp("4.2%"),
    marginBottom: hp("1.5%"),
  },
  learnMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentLight,
    paddingVertical: hp("0.8%"),
    borderRadius: 12,
    gap: 4,
  },
  learnMoreText: {
    fontSize: wp("3.2%"),
    fontWeight: "600",
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("10%"),
    paddingTop: hp("8%"),
  },
  emptyTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
  },
  emptySubtitle: {
    fontSize: wp("3.5%"),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: wp("5%"),
    marginBottom: hp("3%"),
  },
  clearSearchBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.2%"),
    borderRadius: 20,
  },
  clearSearchText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: wp("3.5%"),
  },
});
