// app/_layout.tsx
import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext, AuthProvider } from '../context/AuthContext';

const InitialLayout = () => {
  const authContext = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait until the auth state is fully loaded
    if (authContext?.isLoading === false) {
      const inAuthGroup = segments[0] === '(auth)';

      // If the user is signed in and the current route is not in the main app group,
      // redirect them to the home screen.
      if (authContext.userToken && inAuthGroup) {
        router.replace('/HomeScreen');
      } 
      // If the user is not signed in and the current route is not in the auth group,
      // redirect them to the login screen.
      else if (!authContext.userToken && !inAuthGroup) {
        router.replace('/LoginScreen');
      }
    }
  }, [authContext?.isLoading, authContext?.userToken]); // Re-run effect when loading state or token changes

  // While checking for the token, show a loading spinner.
  if (authContext?.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If the auth state is loaded, render the current screen.
  return <Slot />;
};

// Root layout component wraps everything with the AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}