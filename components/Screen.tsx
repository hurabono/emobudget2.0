// components/Screen.tsx
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

type ScreenProps = {
  children: React.ReactNode;
  center?: boolean;
  maxWidth?: number;
  centerVertically?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  paddingH?: number;
  paddingTop?: number;
};

export default function Screen({
  children,
  center = false,
  maxWidth = 480,
  centerVertically = false,
  style,
  contentStyle,
  paddingH = 20,
  paddingTop = 16,
}: ScreenProps) {
  return (
    <ScrollView
      style={[styles.scroll, style]}
      contentContainerStyle={[
        styles.ccBase,
        centerVertically && styles.ccCenterVertical,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View
        style={[
          { paddingHorizontal: paddingH, paddingTop },
          center
            ? { alignSelf: 'center', width: '100%', maxWidth }
            : { alignSelf: 'stretch', width: '100%' },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  ccBase: { paddingBottom: 24 },
  ccCenterVertical: { flexGrow: 1, justifyContent: 'center' },
});
