// app/_layout.tsx
import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import './global.css';

// 추가: 폰트 로드 (Roboto Flex + Inria Serif)
import {
  RobotoFlex_400Regular,
  useFonts as useRobotoFlex,
} from '@expo-google-fonts/roboto-flex';

import {
  InriaSerif_400Regular,
  InriaSerif_700Bold,
  useFonts as useInria,
} from '@expo-google-fonts/inria-serif';

const InitialLayout = () => {
  const authContext = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authContext?.isLoading === false) {
      const inAuthGroup = segments[0] === '(auth)';
      if (authContext.userToken && inAuthGroup) {
        router.replace('/HomeScreen');
      } else if (!authContext.userToken && !inAuthGroup) {
        router.replace('/LoginScreen');
      }
    }
  }, [authContext?.isLoading, authContext?.userToken]);

  if (authContext?.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
};

export default function RootLayout() {
  // ✅ 추가: 폰트 로드 (로직 변경 없음, 로드 전엔 간단 로더만 표시)
  const [robotoLoaded] = useRobotoFlex({
    RobotoFlex_400Regular,

  });

  const [inriaLoaded] = useInria({
    InriaSerif_400Regular,
    InriaSerif_700Bold,
  });

  const fontsLoaded = robotoLoaded && inriaLoaded;

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      {/* 전역 그라데이션 유지 */}
      <GradientBackground>
        <View style={{ flex: 1 }}>
          <InitialLayout />
        </View>
      </GradientBackground>
    </AuthProvider>
  );
}
