import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../Theme/colors";
import { useLocalSearchParams } from "expo-router";
import { RegisterApi } from "../Api/userApi";
import BrandHiveLogo from "../components/common/BrandHiveLogo";
const RegisterScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialRole = params.role ? String(params.role).toLowerCase() : "buyer";

  const [role, setRole] = useState(initialRole);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onBackPress = () => {
      if (!router.canGoBack()) {
        router.replace("/Buyer/Authentication/RoleSelectionScreen");
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => subscription.remove();
  }, [router]);

  const handleSignUp = async () => {
    if (!username.trim()) {
      setErrorMessage("Username is required");
      setShowErrorModal(true);
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Email is required");
      setShowErrorModal(true);
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Password is required");
      setShowErrorModal(true);
      return;
    }

    if (password.trim().length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setShowErrorModal(true);
      return;
    }

    if (!agreeTerms) {
      setErrorMessage(
        "You must agree to the Terms & Privacy Policy to continue.",
      );
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await RegisterApi(username.trim(), email.trim(), password, initialRole);

      if (res?.isVerified) {
        if (!res.isProfileCompleted) {
          router.replace({
            pathname: "/Buyer/Authentication/ProfileSetupScreen",
            params: { email: email.trim(), username: username.trim() },
          });
        } else if (initialRole === "seller") {
          router.replace("/Seller/Screens/DashboardScreen");
        } else {
          router.replace("/Buyer/Screens/HomeScreen");
        }
      } else {
        router.replace({
          pathname: "/Buyer/Authentication/UserOtpverification",
          params: { email: email.trim(), username: username.trim() },
        });
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/Buyer/Authentication/RoleSelectionScreen");
              }
            }}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={wp("5%")}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <BrandHiveLogo size="large" style={{ marginBottom: 12 }} />
          <Text style={styles.titleText}>Create your account</Text>
        </View>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
            <Ionicons
              name="logo-google"
              size={wp("5%")}
              color="#5954ed"
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
            <Ionicons
              name="logo-apple"
              size={wp("5%")}
              color="#000000"
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="ethan_miller"
              placeholderTextColor={colors.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="ethan_miller007@gmail.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••••••"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setSecureText(!secureText)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={secureText ? "eye-off-outline" : "eye-outline"}
                  size={wp("5%")}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.agreeRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAgreeTerms(!agreeTerms)}
              style={[
                styles.customSwitch,
                { backgroundColor: agreeTerms ? colors.button : colors.border },
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  { alignSelf: agreeTerms ? "flex-end" : "flex-start" },
                ]}
              />
            </TouchableOpacity>
            <View style={styles.agreeTextContainer}>
              <Text style={styles.agreeTextText}>I agree to the </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/Buyer/Authentication/TermsconditionsScreen")
                }
                activeOpacity={0.7}
              >
                <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.signUpButton,
            isLoading && styles.signUpButtonDisabled,
          ]}
          onPress={handleSignUp}
          activeOpacity={0.9}
          disabled={isLoading}
        >
          <Text style={styles.signUpButtonText}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/Buyer/Authentication/LoginScreen",
                params: { role },
              })
            }
            activeOpacity={0.7}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalContent}>
            <View style={styles.errorIconContainer}>
              <Ionicons
                name="alert-circle"
                size={wp("14%")}
                color={colors.error}
              />
            </View>
            <Text style={styles.errorModalTitle}>Required Field</Text>
            <Text style={styles.errorModalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.errorModalButton}
              onPress={() => setShowErrorModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.errorModalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp("6%"),
    paddingBottom: hp("4%"),
  },
  header: {
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: hp("1%"),
  },
  backButton: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  titleContainer: {
    marginTop: hp("2.5%"),
    alignItems: "center",
    marginBottom: hp("3.5%"),
  },
  titleText: {
    fontSize: wp("7.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: hp("1%"),
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp("4%"),
    marginBottom: hp("3%"),
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    height: hp("6%"),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: wp("6%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  socialIcon: {
    marginRight: wp("2%"),
  },
  socialButtonText: {
    fontSize: wp("3.8%"),
    fontWeight: "600",
    color: colors.textPrimary,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: wp("4%"),
    fontSize: wp("3.6%"),
    color: colors.textSecondary,
  },
  form: {
    marginBottom: hp("3.5%"),
  },
  inputGroup: {
    marginBottom: hp("2.5%"),
  },
  label: {
    fontSize: wp("3.6%"),
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: hp("1%"),
  },
  input: {
    height: hp("6%"),
    borderRadius: wp("6%"),
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: wp("5%"),
    fontSize: wp("3.8%"),
    color: colors.textPrimary,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: hp("6%"),
    borderRadius: wp("6%"),
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: wp("5%"),
    paddingRight: wp("2.5%"),
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: wp("3.8%"),
    color: colors.textPrimary,
  },
  eyeButton: {
    width: wp("10%"),
    height: wp("10%"),
    justifyContent: "center",
    alignItems: "center",
  },
  agreeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
    marginTop: hp("1.5%"),
  },
  customSwitch: {
    width: wp("9%"),
    height: wp("5%"),
    borderRadius: wp("2.5%"),
    padding: wp("0.5%"),
    justifyContent: "center",
  },
  switchThumb: {
    width: wp("4%"),
    height: wp("4%"),
    borderRadius: wp("2%"),
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 2,
  },
  agreeTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  agreeTextText: {
    fontSize: wp("3.6%"),
    color: colors.textSecondary,
  },
  termsLink: {
    fontSize: wp("3.6%"),
    fontWeight: "700",
    color: colors.textPrimary,
    textDecorationLine: "underline",
  },
  signUpButton: {
    height: hp("6.5%"),
    borderRadius: wp("6.5%"),
    backgroundColor: colors.button,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("3%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  signUpButtonText: {
    color: colors.white,
    fontSize: wp("4%"),
    fontWeight: "700",
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("1.2%"),
  },
  footerText: {
    fontSize: wp("3.6%"),
    color: colors.textSecondary,
  },
  signInText: {
    fontSize: wp("3.6%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("6%"),
  },
  modalContent: {
    width: wp("85%"),
    backgroundColor: colors.white,
    borderRadius: wp("6%"),
    paddingVertical: hp("4%"),
    paddingHorizontal: wp("6%"),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  errorModalContent: {
    width: wp("80%"),
    backgroundColor: colors.white,
    borderRadius: wp("5%"),
    paddingVertical: hp("3%"),
    paddingHorizontal: wp("5%"),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  errorIconContainer: {
    marginBottom: hp("1.5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  errorModalTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  errorModalMessage: {
    fontSize: wp("3.6%"),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: wp("5%"),
    marginBottom: hp("2.5%"),
  },
  errorModalButton: {
    width: "100%",
    height: hp("5.5%"),
    borderRadius: wp("5.5%"),
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  errorModalButtonText: {
    color: colors.white,
    fontSize: wp("3.8%"),
    fontWeight: "700",
  },
});
