import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import colors from "../../../Theme/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { userInfo, switchRoleApi, logoutApi, deleteAccountApi } from "../Api/userApi";
import ProfileHeader from "../../Profile/components/ProfileHeader";
import ProfileCompletionCard from "../../Profile/components/ProfileCompletionCard";
import SettingsSection from "../../Profile/components/SettingsSection";
import SettingsRow from "../../Profile/components/SettingsRow";

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await userInfo();
      if (res?.user) setUser(res.user);
    } catch (e) {
      console.log("ProfileScreen fetchUser Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const handleSwitchRole = async () => {
    const hasSellerRole =
      user?.roles && Array.isArray(user.roles) && user.roles.includes("seller");

    if (hasSellerRole) {
      Alert.alert("Switch Account Mode", "Switch to your Seller Dashboard?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch to Seller",
          onPress: async () => {
            try {
              const res = await switchRoleApi("seller");
              if (res?.success) {
                router.replace("/Seller/Screens/DashboardScreen");
              }
            } catch (e) {
              Alert.alert("Error", e?.message || "Failed to switch mode.");
            }
          },
        },
      ]);
    } else {
      Alert.alert(
        "Register as Seller Required",
        `You are currently registered only as a Buyer. To switch to Seller mode, please select 'I am a Space Owner' (Seller) on the Role Selection screen and register using your existing email (${user?.email || ""}) and username (${user?.username || ""}).`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Go to Role Selection",
            onPress: () =>
              router.push({
                pathname: "/Buyer/Authentication/RoleSelectionScreen",
                params: {
                  email: user?.email,
                  username: user?.username,
                  targetRole: "seller",
                  showNoticeModal: "true",
                },
              }),
          },
        ]
      );
    }
  };

  const handleSignOut = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out of BrandHive?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutApi();
          } catch (e) {
            console.log("Signout error:", e);
          }
          router.replace("/Buyer/Authentication/LoginScreen");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your BrandHive account? This action is permanent and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccountApi();
              router.replace("/Buyer/Authentication/LoginScreen");
            } catch (e) {
              Alert.alert("Error", e?.message || "Failed to delete account.");
            }
          },
        },
      ]
    );
  };

  const hasSellerRole =
    user?.roles && Array.isArray(user.roles) && user.roles.includes("seller");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
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
          {/* Header Card */}
          <ProfileHeader
            user={user}
            mode="buyer"
            onEditPress={() =>
              router.push("/Buyer/components/Profile/EditProfileScreen")
            }
          />

          {/* Profile Strength Widget - Hides automatically when 100% */}
          <ProfileCompletionCard
            user={user}
            mode="buyer"
            onCompletePress={() =>
              router.push("/Buyer/components/Profile/EditProfileScreen")
            }
          />

          <SettingsSection title="ACCOUNT & SECURITY">
            <SettingsRow
              icon="person-outline"
              iconColor="#2563EB"
              title="Personal Information"
              subtitle="Name, email, phone & location"
              onPress={() =>
                router.push("/Buyer/components/Profile/EditProfileScreen")
              }
            />
            <SettingsRow
              icon="lock-closed-outline"
              iconColor="#059669"
              title="Password & Security"
              subtitle="Change password and security controls"
              onPress={() =>
                router.push("/Profile/screens/PasswordSecurityScreen")
              }
            />
            <SettingsRow
              icon="swap-horizontal-outline"
              iconColor="#7C3AED"
              title="Switch to Seller Mode"
              subtitle="Access your Seller Dashboard"
              badge={hasSellerRole ? "Seller Active" : null}
              badgeColor={hasSellerRole ? "#7C3AED" : undefined}
              onPress={handleSwitchRole}
              isLast={true}
            />
          </SettingsSection>

          <SettingsSection title="PREFERENCES & PRIVACY">
            <SettingsRow
              icon="notifications-outline"
              iconColor="#111827"
              title="Notification Settings"
              subtitle="Push alerts, email updates & booking reminders"
              onPress={() =>
                router.push("/Profile/screens/NotificationSettingsScreen")
              }
            />
            <SettingsRow
              icon="shield-checkmark-outline"
              iconColor="#0891B2"
              title="Privacy & Data Settings"
              subtitle="Profile visibility and contact options"
              onPress={() =>
                router.push("/Profile/screens/PrivacySettingsScreen")
              }
              isLast={true}
            />
          </SettingsSection>

          <SettingsSection title="BOOKINGS & FAVOURITES">
            <SettingsRow
              icon="calendar-outline"
              iconColor="#10B981"
              title="My Bookings & Invoices"
              subtitle="View past & active ad space bookings"
              onPress={() => router.push("/Buyer/Screens/BookingScreen")}
            />
            <SettingsRow
              icon="heart-outline"
              iconColor="#EC4899"
              title="Saved Ad Spaces"
              subtitle="View bookmarked billboards & digital screens"
              isLast={true}
              onPress={() =>
                Alert.alert("Saved Spaces", "Saved ad spaces feature is coming soon!")
              }
            />
          </SettingsSection>

          <SettingsSection title="SUPPORT & LEGAL">
            <SettingsRow
              icon="help-circle-outline"
              iconColor="#2563EB"
              title="Help Center & Support"
              subtitle="24/7 Support team & answers"
              onPress={() =>
                Alert.alert(
                  "Support",
                  "Need help? Email us at support@brandhive.com or call support."
                )
              }
            />
            <SettingsRow
              icon="document-text-outline"
              iconColor="#475569"
              title="Terms & Conditions"
              onPress={() =>
                router.push("/Buyer/Authentication/TermsconditionsScreen")
              }
            />
            <SettingsRow
              icon="shield-outline"
              iconColor="#059669"
              title="Privacy Policy"
              isLast={true}
              onPress={() =>
                Alert.alert(
                  "Privacy Policy",
                  "BrandHive strictly enforces data protection and user privacy compliance."
                )
              }
            />
          </SettingsSection>

          <SettingsSection title="APPLICATION">
            <SettingsRow
              icon="phone-portrait-outline"
              iconColor="#7C3AED"
              title="App Version"
              value="v1.0.0 (Production)"
              hideChevron={true}
              isLast={true}
            />
          </SettingsSection>

          <SettingsSection>
            <SettingsRow
              icon="log-out-outline"
              iconColor="#DC2626"
              title="Log Out Account"
              isDestructive={true}
              hideChevron={true}
              onPress={handleSignOut}
            />
            <SettingsRow
              icon="trash-outline"
              iconColor="#DC2626"
              title="Delete Account"
              subtitle="Permanently remove your profile data"
              isDestructive={true}
              isLast={true}
              onPress={handleDeleteAccount}
            />
          </SettingsSection>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: hp("16%"),
  },
});
