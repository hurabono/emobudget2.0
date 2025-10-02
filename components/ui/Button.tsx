import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

export default function Button({ label, variant = "primary", disabled, ...rest }: any) {
  const base = "rounded-pill h-12 px-5 items-center justify-center";
  if (variant === "primary") {
    return (
      <Pressable disabled={disabled} className={base} {...rest}>
        <LinearGradient
          colors={disabled ? ["#E4E1EC", "#E4E1EC"] : ["#FBCBC9", "#93A9D1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, width: "100%", borderRadius: 999 }}
        >
          <View className="flex-1 items-center justify-center">
            <Text className={`font-heading text-lg ${disabled ? "text-brand-mute" : "text-white"}`}>{label}</Text>
          </View>
        </LinearGradient>
      </Pressable>
    );
  }
  if (variant === "outline") {
    return (
      <Pressable disabled={disabled} className={`${base} border border-bg-tint bg-transparent`} {...rest}>
        <Text className={`font-heading text-lg ${disabled ? "text-brand-mute" : "text-txt"}`}>{label}</Text>
      </Pressable>
    );
  }
  return null;
}
