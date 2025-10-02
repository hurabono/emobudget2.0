import { View } from "react-native";
export default function Card({ className = "", ...props }: any) {
  return (
    <View
      className={`rounded-2xl bg-white/90 border border-bg-tint shadow-soft p-4 ${className}`}
      {...props}
    />
  );
}