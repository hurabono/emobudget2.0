import React from "react";
import { ScrollView, Text } from "react-native";

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error("❌ ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#b91c1c" }}>
            화면 렌더링 중 오류가 발생했어요
          </Text>
          <Text style={{ marginTop: 8, color: "#111" }}>
            {String(this.state.error?.message || this.state.error)}
          </Text>
        </ScrollView>
      );
    }
    return <>{this.props.children}</>;
  }
}
