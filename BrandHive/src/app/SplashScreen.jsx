import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import colors from "../Theme/colors";
import axios from "axios";
import { userInfo } from "./Buyer/Api/userApi";

const SplashScreen = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [dots, setDots] = useState("");
  const router = useRouter();

  const iconTranslateY = useRef(new Animated.Value(-600)).current;
  const iconTranslateX = useRef(new Animated.Value(80)).current;
  const textTranslateX = useRef(new Animated.Value(-40)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;

  const checkAuth = async () => {
    try {
      let accessToken = await SecureStore.getItemAsync("accessToken");

      if (!accessToken) {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) {
          router.replace("/Buyer/Authentication/RoleSelectionScreen");
          return;
        }

        try {
          const res = await axios.post(
            "http://10.221.22.24:3000/auth/refresh-token",
            { refreshToken }
          );

          if (res.data?.accessToken) {
            accessToken = res.data.accessToken;
            await SecureStore.setItemAsync("accessToken", accessToken);
          } else {
            throw new Error("No access token returned");
          }
        } catch (refreshErr) {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          router.replace("/Buyer/Authentication/RoleSelectionScreen");
          return;
        }
      }

      try {
        const localActiveRole = await SecureStore.getItemAsync("activeRole");
        const userData = await userInfo();
        const user = userData?.user;

        if (!user) {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          await SecureStore.deleteItemAsync("activeRole");
          router.replace("/Buyer/Authentication/RoleSelectionScreen");
          return;
        }

        if (!user.isVerified) {
          router.replace({
            pathname: "/Buyer/Authentication/UserOtpverification",
            params: { email: user.email, username: user.username },
          });
          return;
        }

        if (!user.isProfileCompleted) {
          router.replace({
            pathname: "/Buyer/Authentication/ProfileSetupScreen",
            params: { email: user.email, username: user.username },
          });
          return;
        }

        const effectiveRole = localActiveRole || user.activeRole || "buyer";

        if (effectiveRole === "seller") {
          router.replace("/Seller/Screens/DashboardScreen");
        } else {
          router.replace("/Buyer/Screens/HomeScreen");
        }
      } catch (userErr) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("activeRole");
        router.replace("/Buyer/Authentication/RoleSelectionScreen");
      }
    } catch (error) {
      router.replace("/Buyer/Authentication/RoleSelectionScreen");
    }
  };

 
  useEffect(() => {
   
    Animated.spring(iconTranslateY, {
      toValue: 0,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
     
      Animated.parallel([
        Animated.timing(iconTranslateX, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateX, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start(() => {
        
        setShowLoading(true);
      });
    });
    
  }, []);


  useEffect(() => {
    if (!showLoading) return;

    let timerid;

    const action = () => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });

      timerid = setTimeout(action, 500);
    };

    action();

    return () => clearTimeout(timerid);
  }, [showLoading]);

  useEffect(() => {
    if (!showLoading) return;

    Animated.timing(loadingOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      checkAuth();
    }, 2000);

    return () => clearTimeout(timer);
  }, [showLoading]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoBadge,
              {
                transform: [
                  { translateY: iconTranslateY },
                  { translateX: iconTranslateX },
                ],
              },
            ]}
          >
            <Text style={styles.logoBadgeText}>BH</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textOpacity,
                transform: [{ translateX: textTranslateX }],
              },
            ]}
          >
            <Text style={styles.brandText}>Brand</Text>
            <Text style={styles.hiveText}>Hive</Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[styles.loadingContainer, { opacity: loadingOpacity }]}
        >
          {showLoading && <Text style={styles.loadingText}>Loading{dots}</Text>}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoBadgeText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -1,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp("1%"),
  },
  brandText: {
    fontSize: wp("8%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  hiveText: {
    fontSize: wp("8%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  loadingContainer: {
    position: "absolute",
    bottom: wp("15%"),
    alignItems: "center",
  },
  loadingText: {
    fontSize: wp("4%"),
    fontWeight: "500",
    color: colors.textSecondary,
    letterSpacing: 1.2,
  },
});
