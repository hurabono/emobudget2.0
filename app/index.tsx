// app/index.tsx
import { Redirect } from 'expo-router';
import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const StartPage = () => {
  const authContext = useContext(AuthContext);

  // 1. While the auth state is loading, show a spinner.
  if (!authContext || authContext.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2. If the user is not logged in, redirect to the login screen.
  if (!authContext.userToken) {
    return <Redirect href="/LoginScreen" />;
  }

  // 3. If the user is logged in, redirect to the main app screen.
  return <Redirect href="/HomeScreen" />;
};

export default StartPage;