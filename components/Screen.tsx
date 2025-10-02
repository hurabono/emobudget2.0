// components/Screen.tsx
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function Screen({ children }: any) {
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 24 }}
      style={{ flex: 1 }}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        {children}
      </View>
    </ScrollView>
  );
}
