import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../../Theme/colors";
import { userInfo, updatePrivacySettingsApi } from "../../Buyer/Api/userApi";
import SettingsSection from "../components/SettingsSection";
import SettingsRow from "../components/SettingsRow";

const PrivacySettingsScreen = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    showLocation: true,
  });

  useEffect(() => {
    fetchPrivacy();
  }, []);

  const fetchPrivacy = async () => {
    setLoading(true);
    try {
      const res = await userInfo();
      if (res?.user?.privacySettings) {
        setPrivacy((prev) => ({
          ...prev,
          ...res.user.privacySettings,
        }));
      }
    } catch (e) {
      console.log("Error loading privacy settings:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key, val) => {
    const updated = { ...privacy, [key]: val };
    setPrivacy(updated);
    setSaving(true);
    try {
      await updatePrivacySettingsApi(updated);
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to update privacy settings");
      setPrivacy(privacy);
    } finally {
      setSaving(false);
    }
  };

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
        <Text style={styles.headerTitle}>Privacy & Data</Text>
        <View style={{ width: 40 }}>
          {saving ? <ActivityIndicator size="small" color={colors.primary} /> : null}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.textPrimary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <SettingsSection title="PROFILE VISIBILITY">
            <SettingsRow
              icon="eye-outline"
              iconColor="#2563EB"
              title="Public Profile Visibility"
              subtitle="Allow buyers and sellers to discover your profile"
              isSwitch={true}
              switchValue={privacy.profileVisible}
              onSwitchChange={(val) => handleToggle("profileVisible", val)}
            />
            <SettingsRow
              icon="location-outline"
              iconColor="#EF4444"
              title="Show City & State"
              subtitle="Display your location on active listings"
              isSwitch={true}
              switchValue={privacy.showLocation}
              onSwitchChange={(val) => handleToggle("showLocation", val)}
              isLast={true}
            />
          </SettingsSection>

          <SettingsSection title="CONTACT PRIVACY">
            <SettingsRow
              icon="mail-outline"
              iconColor="#3B82F6"
              title="Display Email Address"
              subtitle="Allow other verified users to view your email"
              isSwitch={true}
              switchValue={privacy.showEmail}
              onSwitchChange={(val) => handleToggle("showEmail", val)}
            />
            <SettingsRow
              icon="call-outline"
              iconColor="#10B981"
              title="Display Mobile Number"
              subtitle="Allow verified buyers/sellers to contact you directly"
              isSwitch={true}
              switchValue={privacy.showPhone}
              onSwitchChange={(val) => handleToggle("showPhone", val)}
              isLast={true}
            />
          </SettingsSection>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default PrivacySettingsScreen;

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
  },
});
