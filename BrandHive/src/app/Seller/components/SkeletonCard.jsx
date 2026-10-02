import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import colors from "../../../Theme/colors";

const SkeletonCard = ({ type = "card", count = 3 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const items = Array.from({ length: count });

  if (type === "dashboard") {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.dashboardBanner, { opacity }]} />
        <View style={styles.statsGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Animated.View key={i} style={[styles.statBox, { opacity }]} />
          ))}
        </View>
        <Animated.View style={[styles.sectionHeader, { opacity }]} />
        {Array.from({ length: 3 }).map((_, i) => (
          <Animated.View key={i} style={[styles.categoryRow, { opacity }]} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.map((_, i) => (
        <Animated.View key={i} style={[styles.card, { opacity }]}>
          <View style={styles.cardHeader}>
            <View style={styles.thumb} />
            <View style={styles.lines}>
              <View style={styles.line1} />
              <View style={styles.line2} />
              <View style={styles.line3} />
            </View>
          </View>
          <View style={styles.footer} />
        </Animated.View>
      ))}
    </View>
  );
};

export default SkeletonCard;

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 12,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
  },
  lines: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
  },
  line1: {
    height: 14,
    width: "70%",
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  line2: {
    height: 12,
    width: "50%",
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  line3: {
    height: 12,
    width: "35%",
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  footer: {
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  dashboardBanner: {
    height: 100,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statBox: {
    width: "48%",
    height: 80,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
  sectionHeader: {
    height: 20,
    width: 140,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    marginTop: 8,
  },
  categoryRow: {
    height: 60,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
});
