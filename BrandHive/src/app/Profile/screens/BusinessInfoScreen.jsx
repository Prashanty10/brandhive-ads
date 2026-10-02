import React, { useState, useEffect } from "react";
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
import { userInfo, updateSellerProfileApi } from "../../Buyer/Api/userApi";

const BusinessInfoScreen = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Agency");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessState, setBusinessState] = useState("");
  const [businessPincode, setBusinessPincode] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    setLoading(true);
    try {
      const res = await userInfo();
      const sp = res?.user?.sellerProfile || {};
      setBusinessName(sp.businessName || "");
      setBusinessType(sp.businessType || "Media Owner");
      setBusinessDescription(sp.businessDescription || "");
      setBusinessAddress(sp.businessAddress || "");
      setBusinessCity(sp.businessCity || res?.user?.city || "");
      setBusinessState(sp.businessState || res?.user?.state || "");
      setBusinessPincode(sp.businessPincode || "");
      setGstNumber(sp.gstNumber || "");
      setPanNumber(sp.panNumber || "");
    } catch (e) {
      console.log("Error fetching seller profile:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!businessName.trim()) {
      Alert.alert("Validation Error", "Please enter your business or company name.");
      return;
    }

    setSaving(true);
    try {
      const sellerData = {
        sellerProfile: {
          businessName: businessName.trim(),
          businessType: businessType.trim(),
          businessDescription: businessDescription.trim(),
          businessAddress: businessAddress.trim(),
          businessCity: businessCity.trim(),
          businessState: businessState.trim(),
          businessPincode: businessPincode.trim(),
          gstNumber: gstNumber.trim().toUpperCase(),
          panNumber: panNumber.trim().toUpperCase(),
        },
      };

      await updateSellerProfileApi(sellerData);
      Alert.alert("Success 🎉", "Business information updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to update business details.");
    } finally {
      setSaving(false);
    }
  };

  const businessTypes = ["Media Owner", "Agency", "Individual Owner", "Enterprise"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Information</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.textPrimary} />
        </View>
      ) : (
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          enableOnAndroid={true}
        >
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>COMPANY DETAILS</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business / Brand Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Acme Advertising Ltd."
                placeholderTextColor={colors.textMuted}
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Type</Text>
              <View style={styles.typeChipsRow}>
                {businessTypes.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeChip,
                      businessType === t && styles.typeChipSelected,
                    ]}
                    onPress={() => setBusinessType(t)}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        businessType === t && styles.typeChipTextSelected,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Overview</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Describe your ad network or space inventory..."
                placeholderTextColor={colors.textMuted}
                value={businessDescription}
                onChangeText={setBusinessDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>BUSINESS ADDRESS</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Building no, Street name"
                placeholderTextColor={colors.textMuted}
                value={businessAddress}
                onChangeText={setBusinessAddress}
              />
            </View>

            <View style={styles.rowTwo}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor={colors.textMuted}
                  value={businessCity}
                  onChangeText={setBusinessCity}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor={colors.textMuted}
                  value={businessState}
                  onChangeText={setBusinessState}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pincode / Postal Code</Text>
              <TextInput
                style={styles.input}
                placeholder="6-digit Pincode"
                placeholderTextColor={colors.textMuted}
                value={businessPincode}
                onChangeText={setBusinessPincode}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>TAX & COMPLIANCE</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>GST Number (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 22AAAAA0000A1Z5"
                placeholderTextColor={colors.textMuted}
                value={gstNumber}
                onChangeText={setGstNumber}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PAN Number (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. ABCDE1234F"
                placeholderTextColor={colors.textMuted}
                value={panNumber}
                onChangeText={setPanNumber}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.btnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.88}
          >
            {saving ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.saveBtnText}>Save Business Details</Text>
            )}
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
};

export default BusinessInfoScreen;

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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: {
    padding: 20,
    gap: 16,
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
  multilineInput: {
    height: 80,
    paddingTop: 12,
  },
  typeChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  typeChipSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  typeChipTextSelected: {
    color: "#2563EB",
    fontWeight: "700",
  },
  rowTwo: {
    flexDirection: "row",
    gap: 12,
  },
  saveBtn: {
    height: 50,
    backgroundColor: colors.button,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  btnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});
