// components/GradientBackground.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function GradientBackground({ children }: { children: ReactNode }) {
  return (
    <View style={styles.root}>
      {/* 그라데이션 배경 */}
      <LinearGradient
        colors={["#93A9D1", "#FBCBC9", "#F7DFE0"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Image
        source={require("../assets/images/Group9.png")}
        style={styles.topImage}
        resizeMode="contain"
      />

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: "relative",
    minHeight: "100%" as any,
  },
  content: {
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
  topImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width:"100%",
    zIndex: 0,
  },
});
