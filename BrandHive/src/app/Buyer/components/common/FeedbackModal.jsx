import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../Theme/colors";

const TYPE_CONFIG = {
  success: {
    icon: "checkmark-circle",
    iconColor: "#059669",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    badgeTitle: "SUCCESS",
    btnColor: colors.button || "#111827",
  },
  error: {
    icon: "alert-circle",
    iconColor: "#EF4444",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
    badgeTitle: "ERROR",
    btnColor: "#EF4444",
  },
  warning: {
    icon: "warning",
    iconColor: "#F59E0B",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
    badgeTitle: "NOTICE",
    btnColor: "#D97706",
  },
  info: {
    icon: "information-circle",
    iconColor: colors.primary || "#2563EB",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    badgeTitle: "INFORMATION",
    btnColor: colors.primary || "#2563EB",
  },
};

const FeedbackModal = ({
  visible = false,
  type = "success",
  title = "",
  message = "",
  details = null,
  primaryBtnText = "OK",
  onPrimaryPress,
  secondaryBtnText = null,
  onSecondaryPress,
  onClose,
}) => {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose || onPrimaryPress}
    >
      <TouchableWithoutFeedback onPress={onClose || onPrimaryPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Top Icon Badge Header */}
              <View style={[styles.iconWrapper, { backgroundColor: config.bgColor, borderColor: config.borderColor }]}>
                <Ionicons name={config.icon} size={36} color={config.iconColor} />
              </View>

              {/* Title & Message */}
              <Text style={styles.title}>{title}</Text>
              {message ? <Text style={styles.message}>{message}</Text> : null}

              {/* Optional Details Key-Value List */}
              {details && typeof details === "object" ? (
                <View style={styles.detailsContainer}>
                  {Object.entries(details).map(([key, val], idx) => (
                    <View key={idx} style={styles.detailRow}>
                      <Text style={styles.detailKey}>{key}:</Text>
                      <Text style={styles.detailVal}>{String(val)}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                {secondaryBtnText ? (
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    activeOpacity={0.8}
                    onPress={onSecondaryPress || onClose}
                  >
                    <Text style={styles.secondaryBtnText}>{secondaryBtnText}</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    { backgroundColor: config.btnColor },
                    secondaryBtnText ? { flex: 2 } : { flex: 1 },
                  ]}
                  activeOpacity={0.88}
                  onPress={onPrimaryPress || onClose}
                >
                  <Text style={styles.primaryBtnText}>{primaryBtnText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FeedbackModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 18,
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailKey: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  detailVal: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    marginTop: 4,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  secondaryBtnText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
});
