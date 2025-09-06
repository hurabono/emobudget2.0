// app/_layout.tsx
import { Slot } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';

// The root layout provides context and renders the current route. No logic here.
export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}