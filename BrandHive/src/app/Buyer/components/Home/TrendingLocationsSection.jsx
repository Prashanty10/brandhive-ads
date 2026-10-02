import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../Theme/colors";
import { trendingLocationsData } from "./data/trendingLocationsData";

const TrendingLocationsSection = () => {
  const router = useRouter();

  const handlePress = (cityName) => {
    router.push({
      pathname: "/Buyer/advertisement/offline/OfflineCategoryScreen",
      params: { city: cityName },
    });
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => handlePress(item.cityName)}
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.cityName}>{item.cityName}</Text>
          <View style={styles.countBadge}>
            <Ionicons name="location" size={11} color="#FFFFFF" />
            <Text style={styles.countText}>{item.count}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending Locations</Text>
        <Text style={styles.sectionSubtitle}>
          Explore advertisements across cities
        </Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={trendingLocationsData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderCard}
      />
    </View>
  );
};

export default TrendingLocationsSection;

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 28,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 14,
  },
  card: {
    width: wp("42%"),
    height: hp("18%"),
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: colors.neutralLight,
    position: "relative",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    justifyContent: "flex-end",
    padding: 12,
  },
  content: {
    gap: 4,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: -0.2,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  countText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
});
