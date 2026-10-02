import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../../Theme/colors";
import { registerRoleApi } from "../../Buyer/Api/userApi";

const SellerOnboardingScreen = () => {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Media Owner");
  const [businessCity, setBusinessCity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBecomeSeller = async () => {
    if (!businessName.trim()) {
      Alert.alert("Required", "Please enter your business or company name to continue.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerRoleApi("seller", {
        businessName: businessName.trim(),
        businessType,
        businessCity: businessCity.trim(),
      });

      if (res?.success) {
        Alert.alert(
          "Welcome Seller! 🎉",
          "Your seller account has been activated successfully.",
          [
            {
              text: "Go to Seller Dashboard",
              onPress: () => router.replace("/Seller/Screens/DashboardScreen"),
            },
          ]
        );
      }
    } catch (e) {
      Alert.alert("Registration Failed ⚠️", e.message || "Failed to register seller role.");
    } finally {
      setLoading(false);
    }
  };

  const types = ["Media Owner", "Agency", "Individual Owner", "Enterprise"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Become a Seller</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
      >
        <View style={styles.heroBanner}>
          <View style={styles.heroIconBadge}>
            <Ionicons name="briefcase" size={28} color="#FFF" />
          </View>
          <Text style={styles.heroTitle}>List & Monetize Your Ad Spaces</Text>
          <Text style={styles.heroSubtitle}>
            Join BrandHive marketplace to reach thousands of advertisers, accept booking requests, and manage earnings.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>SELLER ONBOARDING</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business / Brand Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Apex Media Ads"
              placeholderTextColor={colors.textMuted}
              value={businessName}
              onChangeText={setBusinessName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Type</Text>
            <View style={styles.chipsRow}>
              {types.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.chip,
                    businessType === t && styles.chipSelected,
                  ]}
                  onPress={() => setBusinessType(t)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      businessType === t && styles.chipTextSelected,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Operating City</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mumbai, Delhi, Bangalore"
              placeholderTextColor={colors.textMuted}
              value={businessCity}
              onChangeText={setBusinessCity}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.btnDisabled]}
          onPress={handleBecomeSeller}
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Activate Seller Account</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SellerOnboardingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  heroBanner: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  heroIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600", color: colors.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: colors.textPrimary,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: "#2563EB",
    fontWeight: "700",
  },
  submitBtn: {
    height: 52,
    backgroundColor: "#2563EB",
    borderRadius: 26,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  btnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});
