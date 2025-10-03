// components/ui/Card.tsx
import React from "react";
import { Platform, View, ViewProps } from "react-native";

type Props = ViewProps & {
  className?: string;
  variant?: "dark" | "light";
};

export default function Card({
  className = "",
  variant = "dark",
  style,
  ...props
}: Props) {
  const base =
    "rounded-xl p-5 mb-6 border " +
    (variant === "dark"
      ? // 배경/테두리 (이미지처럼 진한 카드)
        "bg-[#1E1E22]/95 border-white/10"
      : "bg-bg-card border-bg-tint");

  // 플랫폼별 그림자 (iOS/Android/웹 모두 커버)
  const shadowStyle =
    Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow:
          "0 10px 60px rgba(0,0,0,0.35), 0 0px 10px rgba(0,0,0,0.25)",
      } as any,
    }) || {};

  return (
    <View className={`${base} ${className}`} style={[shadowStyle, style]} {...props} />
  );
}
