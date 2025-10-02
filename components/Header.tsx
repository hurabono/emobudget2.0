import { Text, View } from "react-native";
export default function Header({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <Text className="font-heading text-2xl text-txt">{title}</Text>
      {right}
    </View>
  );
}