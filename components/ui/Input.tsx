import { TextInput, View } from "react-native";
export default function Input({ className = "", ...props }: any) {
  return (
    <View className={`rounded-2xl bg-white/90 border border-bg-tint shadow-inner ${className}`}>
      <TextInput
        className="h-12 px-4 text-base text-txt"
        placeholderTextColor="#8F8AA6"
        {...props}
      />
    </View>
  );
}