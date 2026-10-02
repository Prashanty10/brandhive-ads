import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../Theme/colors";

export const SkeletonCard = ({ width = wp("78%"), height = hp("26%") }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.skeletonCard, { width, opacity }]}>
      <View style={[styles.skeletonImage, { height: height * 0.55 }]} />
      <View style={styles.skeletonBody}>
        <View style={styles.skeletonLineShort} />
        <View style={styles.skeletonLineFull} />
        <View style={styles.skeletonFooter}>
          <View style={styles.skeletonPrice} />
          <View style={styles.skeletonButton} />
        </View>
      </View>
    </Animated.View>
  );
};

export const SkeletonSection = ({ count = 2 }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerSkeleton}>
        <View style={styles.titleSkeleton} />
        <View style={styles.subtitleSkeleton} />
      </View>
      <View style={styles.cardsRow}>
        {Array.from({ length: count }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  headerSkeleton: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 6,
  },
  titleSkeleton: {
    width: 140,
    height: 18,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
  subtitleSkeleton: {
    width: 200,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  cardsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 14,
  },
  skeletonCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  skeletonImage: {
    width: "100%",
    backgroundColor: "#E2E8F0",
  },
  skeletonBody: {
    padding: 14,
    gap: 8,
  },
  skeletonLineShort: {
    width: "40%",
    height: 12,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  skeletonLineFull: {
    width: "85%",
    height: 16,
    borderRadius: 4,
    backgroundColor: "#CBD5E1",
  },
  skeletonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  skeletonPrice: {
    width: 70,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#CBD5E1",
  },
  skeletonButton: {
    width: 80,
    height: 30,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
  },
});

export default SkeletonSection;
