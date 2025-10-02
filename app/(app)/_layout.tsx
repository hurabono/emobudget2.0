// app/(app)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" options={{ title: 'EmoBudget' }} />
      <Stack.Screen name="PlaidLinkScreen" options={{ title: 'Link Bank Account' }} />
      <Stack.Screen name="TransactionsScreen" options={{ title: 'Transaction List' }} />
    </Stack>
  );
}
