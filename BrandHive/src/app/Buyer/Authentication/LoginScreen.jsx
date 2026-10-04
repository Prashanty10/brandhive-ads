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
import { LoginApi } from "../Api/userApi";
const LoginScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const preferredRole = params.role ? String(params.role).toLowerCase() : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
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

  const handleSignIn = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      setShowErrorModal(true);
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      setShowErrorModal(true);
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Please enter your password.");
      setShowErrorModal(true);
      return;
    }
    if (password.trim().length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setShowErrorModal(true);
      return;
    }
    setIsLoading(true);

    try {
      const res = await LoginApi(email.trim(), password, preferredRole);

      if (!res.isVerified) {
        const fallbackUsername = res.user?.username || email.trim().split("@")[0];
        router.replace({
          pathname: "/Buyer/Authentication/UserOtpverification",
          params: {
            email: email.trim(),
            username: fallbackUsername,
          },
        });
        return;
      }

      if (!res.isProfileCompleted) {
        const fallbackUsername = res.user?.username || email.trim().split("@")[0];
        router.replace({
          pathname: "/Buyer/Authentication/ProfileSetupScreen",
          params: {
            email: email.trim(),
            username: fallbackUsername,
          },
        });
        return;
      }

      const userRole = res.user?.activeRole || preferredRole;
      if (userRole === "seller") {
        router.replace("/Seller/Screens/DashboardScreen");
      } else {
        router.replace("/Buyer/Screens/HomeScreen");
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
        <Text style={styles.titleText}>Welcome Back</Text>
        <Text style={styles.subtitleText}>
          Stay connected by signing in with your email and password to access
          your account.
        </Text>
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
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="prashant@gmail.com"
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

        <View style={styles.rowBetween}>
          <TouchableOpacity
            onPress={() =>
              router.push("/Buyer/Authentication/ResetPasswordScreen")
            }
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
        onPress={handleSignIn}
        activeOpacity={0.9}
        disabled={isLoading}
      >
        <Text style={styles.signInButtonText}>
          {isLoading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>{"Don't have an account? "}</Text>
        <TouchableOpacity
          onPress={() => router.push("/Buyer/Authentication/RegisterScreen")}
          activeOpacity={0.7}
        >
          <Text style={styles.signUpText}>Sign Up</Text>
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
          <Text style={styles.errorModalTitle}>Sign In Error</Text>
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
)};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    marginTop: hp("2%"),
  },
  backButton: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.card,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  titleContainer: {
    marginTop: hp("3%"),
    alignItems: "center",
    marginBottom: hp("3.5%"),
    paddingHorizontal: wp("2%"),
  },
  titleText: {
    fontSize: wp("7.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: hp("1%"),
  },
  subtitleText: {
    fontSize: wp("3.6%"),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: wp("5.2%"),
    paddingHorizontal: wp("4%"),
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp("3%"),
    marginBottom: hp("3.5%"),
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    height: hp("6.5%"),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: wp("7%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.card,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 1,
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
    marginBottom: hp("4%"),
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp("1%"),
  },
  forgotText: {
    fontSize: wp("3.6%"),
    fontWeight: "600",
    color: colors.textPrimary,
  },
  signInButton: {
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
  signInButtonText: {
    color: colors.white,
    fontSize: wp("4%"),
    fontWeight: "700",
  },
  signInButtonDisabled: {
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
  signUpText: {
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
