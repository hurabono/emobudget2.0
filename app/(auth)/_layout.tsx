// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="LoginScreen" options={{ title: 'Login' }} />
      <Stack.Screen name="SignUpScreen" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="VerificationScreen" options={{ title: 'Email Verification' }} />
    </Stack>
  );
}