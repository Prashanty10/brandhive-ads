import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import colors from "../../../Theme/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { userInfo, switchRoleApi, logoutApi, deleteAccountApi } from "../../Buyer/Api/userApi";
import ProfileHeader from "../../Profile/components/ProfileHeader";
import ProfileCompletionCard from "../../Profile/components/ProfileCompletionCard";
import SettingsSection from "../../Profile/components/SettingsSection";
import SettingsRow from "../../Profile/components/SettingsRow";
import SkeletonCard from "../components/SkeletonCard";

const SellerProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await userInfo();
      if (res?.user) setUser(res.user);
    } catch (e) {
      console.log("SellerProfileScreen fetchUser Error:", e);
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
    Alert.alert("Switch Account Mode", "Switch to Buyer mode?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Switch to Buyer",
        onPress: async () => {
          try {
            const res = await switchRoleApi("buyer");
            if (res?.success) {
              router.replace("/Buyer/Screens/HomeScreen");
            }
          } catch (e) {
            Alert.alert("Error", e?.message || "Failed to switch mode.");
          }
        },
      },
    ]);
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
      "Delete Seller Account",
      "Are you sure you want to delete your Seller account? All listed ad spaces and bookings history will be removed.",
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

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Profile</Text>
      </View>

      {loading ? (
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <SkeletonCard type="card" count={2} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Card */}
          <ProfileHeader
            user={user}
            mode="seller"
            onEditPress={() =>
              router.push("/Buyer/components/Profile/EditProfileScreen")
            }
          />

          {/* Profile Completion Strength Card - Hides automatically when 100% */}
          <ProfileCompletionCard
            user={user}
            mode="seller"
            onCompletePress={() =>
              router.push("/Profile/screens/BusinessInfoScreen")
            }
          />

          <SettingsSection title="BUSINESS & INVENTORY">
            <SettingsRow
              icon="business-outline"
              iconColor="#2563EB"
              title="Business Information"
              subtitle="Company details, address & GST details"
              onPress={() =>
                router.push("/Profile/screens/BusinessInfoScreen")
              }
            />
            <SettingsRow
              icon="id-card-outline"
              iconColor="#059669"
              title="KYC & Verification"
              subtitle="Identity and business verification status"
              badge="Verified"
              badgeColor="#059669"
              onPress={() =>
                Alert.alert(
                  "KYC Verified",
                  "Your BrandHive Seller account is fully verified."
                )
              }
            />
            <SettingsRow
              icon="card-outline"
              iconColor="#D97706"
              title="Bank Account & Payouts"
              subtitle="Manage bank accounts & payout preferences"
              onPress={() =>
                Alert.alert(
                  "Payouts",
                  "Bank account and automatic weekly payout settings are active."
                )
              }
            />
            <SettingsRow
              icon="swap-horizontal-outline"
              iconColor="#7C3AED"
              title="Switch to Buyer Mode"
              subtitle="Browse and book ad spaces as an advertiser"
              isLast={true}
              onPress={handleSwitchRole}
            />
          </SettingsSection>

          <SettingsSection title="SECURITY & PREFERENCES">
            <SettingsRow
              icon="lock-closed-outline"
              iconColor="#059669"
              title="Password & Security"
              subtitle="Update password & security parameters"
              onPress={() =>
                router.push("/Profile/screens/PasswordSecurityScreen")
              }
            />
            <SettingsRow
              icon="notifications-outline"
              iconColor="#111827"
              title="Notification Settings"
              subtitle="Booking alerts & payout notifications"
              onPress={() =>
                router.push("/Profile/screens/NotificationSettingsScreen")
              }
            />
            <SettingsRow
              icon="shield-checkmark-outline"
              iconColor="#0891B2"
              title="Privacy & Data"
              subtitle="Manage contact visibility on listings"
              isLast={true}
              onPress={() =>
                router.push("/Profile/screens/PrivacySettingsScreen")
              }
            />
          </SettingsSection>

          <SettingsSection title="SUPPORT & LEGAL">
            <SettingsRow
              icon="help-circle-outline"
              iconColor="#2563EB"
              title="Seller Help Desk"
              subtitle="24/7 Priority support for media sellers"
              onPress={() =>
                Alert.alert(
                  "Seller Priority Support",
                  "Contact priority seller support at seller-support@brandhive.com."
                )
              }
            />
            <SettingsRow
              icon="document-text-outline"
              iconColor="#475569"
              title="Terms & Seller Policy"
              isLast={true}
              onPress={() =>
                router.push("/Buyer/Authentication/TermsconditionsScreen")
              }
            />
          </SettingsSection>

          <SettingsSection title="APPLICATION">
            <SettingsRow
              icon="phone-portrait-outline"
              iconColor="#7C3AED"
              title="App Version"
              value="v1.0.0 (Seller Pro)"
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
              title="Delete Seller Account"
              subtitle="Permanently remove your listings & seller account"
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

export default SellerProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: hp("16%"),
  },
});
