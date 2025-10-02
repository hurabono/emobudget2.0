// components/GradientBackground.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export default function GradientBackground({ children }: { children: ReactNode }) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#FBCBC9", "#F7DFE0", "#93A9D1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 웹에서도 높이가 100%가 되도록 보장 (루트 배경이 투명해졌을 때 특히 중요)
  root: { flex: 1, position: "relative", minHeight: "100%" as any },
  content: { flex: 1, position: "relative", zIndex: 1 },
});
