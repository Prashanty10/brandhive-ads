import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Pressable,
  StatusBar,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../../Theme/colors";
import BrandHiveLogo from "../../components/common/BrandHiveLogo";

const RoleSelectionScreen = () => {
  const router = useRouter();
  const centerScale = useRef(new Animated.Value(0)).current;

  const leftTranslateX = useRef(new Animated.Value(0)).current;
  const rightTranslateX = useRef(new Animated.Value(0)).current;

  const leftRotate = useRef(new Animated.Value(0)).current;
  const rightRotate = useRef(new Animated.Value(0)).current;

  const contentTranslateY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(centerScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(leftTranslateX, {
          toValue: -80,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.timing(rightTranslateX, {
          toValue: 80,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.timing(leftRotate, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.timing(rightRotate, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Animated.Image
          source={{
            uri: "https://i.pinimg.com/1200x/73/9a/78/739a789fb56fc0caf72d54b928363534.jpg",
          }}
          style={[
            styles.leftimage,
            {
              transform: [
                { translateX: leftTranslateX },
                {
                  rotate: leftRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "-15deg"],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.Image
          source={{
            uri: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/realistic-mall-billboard-mockup-template-design-4a63f77b538de2deacf32790f036581c_screen.jpg?ts=1667582409",
          }}
          style={[
            styles.centerimage,
            {
              transform: [{ scale: centerScale }],
            },
          ]}
        />

        <Animated.Image
          source={{
            uri: "https://i.pinimg.com/1200x/86/de/27/86de270a748729d689030837d46fc313.jpg",
          }}
          style={[
            styles.rightimage,
            {
              transform: [
                { translateX: rightTranslateX },
                {
                  rotate: rightRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "15deg"],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{ translateY: contentTranslateY }],
          },
        ]}
      >
        <View style={styles.titleWrapper}>
          <BrandHiveLogo size="large" style={{ alignSelf: "center", marginBottom: 12 }} />
          <Text style={styles.subtitle}>How would you like to get started?</Text>
        </View>

        {/* Card 1: Advertiser / Buyer */}
        <Pressable
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: "/Buyer/Authentication/RegisterScreen",
              params: { role: "buyer" },
            })
          }
        >
          <View style={styles.iconContainerBlue}>
            <Ionicons name="megaphone-outline" size={24} color="#2563EB" />
          </View>

          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>I am an Advertiser</Text>
              <View style={styles.buyerBadge}>
                <Text style={styles.buyerBadgeText}>Buyer</Text>
              </View>
            </View>

            <Text style={styles.cardDescription}>
              Discover and book physical billboards, transit wraps, shopping mall displays & digital ads.
            </Text>
          </View>
        </Pressable>

        {/* Card 2: Space Owner / Seller */}
        <Pressable
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: "/Buyer/Authentication/RegisterScreen",
              params: { role: "seller" },
            })
          }
        >
          <View style={styles.iconContainerPurple}>
            <Ionicons name="storefront-outline" size={24} color="#7C3AED" />
          </View>

          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>I am a Space Owner</Text>
              <View style={styles.sellerBadge}>
                <Text style={styles.sellerBadgeText}>Media Owner</Text>
              </View>
            </View>

            <Text style={styles.cardDescription}>
              List your billboards, transit ads, mall screens, or digital displays to earn revenue.
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: hp("42%"),
    justifyContent: "center",
    alignItems: "center",
  },

  centerimage: {
    width: wp("42%"),
    height: hp("28%"),
    borderRadius: wp("5%"),
    zIndex: 10,
  },

  leftimage: {
    position: "absolute",
    width: wp("38%"),
    height: hp("26%"),
    borderRadius: wp("5%"),
    left: wp("10%"),
  },

  rightimage: {
    position: "absolute",
    width: wp("38%"),
    height: hp("26%"),
    borderRadius: wp("5%"),
    right: wp("10%"),
  },

  contentContainer: {
    paddingHorizontal: wp("5%"),
  },

  titleWrapper: {
    alignItems: "center",
    marginBottom: hp("2.5%"),
  },

  title: {
    fontSize: wp("6.8%"),
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: wp("3.8%"),
    marginTop: hp("0.6%"),
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
    gap: 14,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    paddingBottom:30
  },

  cardPressed: {
    backgroundColor: "#F8FAFC",
    transform: [{ scale: 0.99 }],
  },

  iconContainerBlue: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  iconContainerPurple: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  cardContent: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
    flexWrap: "wrap",
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },

  buyerBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },

  buyerBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },

  sellerBadge: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },

  sellerBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7C3AED",
  },

  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    fontWeight: "400",
  },
});