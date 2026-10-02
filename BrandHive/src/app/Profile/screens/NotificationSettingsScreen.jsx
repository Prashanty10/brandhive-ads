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
import { userInfo, updateNotificationPreferencesApi } from "../../Buyer/Api/userApi";
import SettingsSection from "../components/SettingsSection";
import SettingsRow from "../components/SettingsRow";

const NotificationSettingsScreen = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    pushNotifications: true,
    emailNotifications: true,
    bookingUpdates: true,
    promotionalEmails: false,
    sellerAlerts: true,
  });

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    setLoading(true);
    try {
      const res = await userInfo();
      if (res?.user?.notificationPreferences) {
        setPrefs((prev) => ({
          ...prev,
          ...res.user.notificationPreferences,
        }));
      }
    } catch (e) {
      console.log("Error loading notification preferences:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key, val) => {
    const updated = { ...prefs, [key]: val };
    setPrefs(updated);
    setSaving(true);
    try {
      await updateNotificationPreferencesApi(updated);
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to update notification settings");
      setPrefs(prefs); // Revert on failure
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
        <Text style={styles.headerTitle}>Notification Settings</Text>
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
          <SettingsSection title="GENERAL NOTIFICATIONS">
            <SettingsRow
              icon="notifications-outline"
              iconColor="#2563EB"
              title="Push Notifications"
              subtitle="Receive real-time push alerts on your device"
              isSwitch={true}
              switchValue={prefs.pushNotifications}
              onSwitchChange={(val) => handleToggle("pushNotifications", val)}
            />
            <SettingsRow
              icon="mail-outline"
              iconColor="#3B82F6"
              title="Email Notifications"
              subtitle="Receive confirmation emails and updates"
              isSwitch={true}
              switchValue={prefs.emailNotifications}
              onSwitchChange={(val) => handleToggle("emailNotifications", val)}
              isLast={true}
            />
          </SettingsSection>

          <SettingsSection title="ACTIVITY & ALERTS">
            <SettingsRow
              icon="calendar-outline"
              iconColor="#10B981"
              title="Booking Updates"
              subtitle="Alerts about booking requests, approvals & status"
              isSwitch={true}
              switchValue={prefs.bookingUpdates}
              onSwitchChange={(val) => handleToggle("bookingUpdates", val)}
            />
            <SettingsRow
              icon="briefcase-outline"
              iconColor="#7C3AED"
              title="Seller Workspace Alerts"
              subtitle="Alerts for new buyer inquiries & payouts"
              isSwitch={true}
              switchValue={prefs.sellerAlerts}
              onSwitchChange={(val) => handleToggle("sellerAlerts", val)}
            />
            <SettingsRow
              icon="pricetag-outline"
              iconColor="#F59E0B"
              title="Promotions & News"
              subtitle="Receive special offers, tips, and marketplace news"
              isSwitch={true}
              switchValue={prefs.promotionalEmails}
              onSwitchChange={(val) => handleToggle("promotionalEmails", val)}
              isLast={true}
            />
          </SettingsSection>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default NotificationSettingsScreen;

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
