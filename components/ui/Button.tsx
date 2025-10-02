import { LinearGradient } from "expo-linear-gradient";
import { Pressable, PressableProps, Text, View } from "react-native";

type ButtonProps = PressableProps & {
  label: string;
  variant?: "primary" | "outline";
};

export default function Button({ label, variant = "primary", disabled, ...rest }: ButtonProps) {
  const base = "rounded-pill h-12 px-5 items-center justify-center";

  if (variant === "primary") {
    return (
      <Pressable disabled={disabled} style={{justifyContent:"center", display:"flex", alignItems:"center",}} className={`base`} {...rest}>
        <LinearGradient
          colors={disabled ? ["#E4E1EC", "#E4E1EC"] : ["#FBCBC9", "#93A9D1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderWidth: 3, borderColor: "rgb(143,138,166)", flex: 1, width: 250, borderRadius: 999,  }}
        >
          <View className="flex-1 items-center justify-center py-1">
            <Text className={`font-bold font-heading text-2xl ${disabled ? "text-brand-mute" : "text-[#5B5670]"}`}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === "outline") {
    return (
      <Pressable
        disabled={disabled}
        className={`${base} border border-bg-tint bg-transparent`}
        {...rest}
      >
        <Text className={`font-heading text-lg ${disabled ? "text-brand-mute" : "text-txt"}`}>
          {label}
        </Text>
      </Pressable>
    );
  }

  return null;
}
