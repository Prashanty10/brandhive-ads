import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import colors from "../../../Theme/colors";

const SellerOnboardingScreen = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace({
      pathname: "/Buyer/Authentication/RoleSelectionScreen",
      params: { showNoticeModal: "true" },
    });
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.textPrimary} />
      <Text style={styles.text}>Redirecting to Role Selection...</Text>
    </View>
  );
};

export default SellerOnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
});
