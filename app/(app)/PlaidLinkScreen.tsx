// app/(app)/PlaidLinkScreen.web.tsx
import Screen from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlaidLink } from 'react-plaid-link';
import apiClient from '../../api';
import GradientBackground from '../../components/GradientBackground';
import { AuthContext } from '../../context/AuthContext';



const webAlert = (title: string, message: string) => {
  alert(`${title}\n${message}`);
};

const PlaidLinkScreen = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const createLinkToken = useCallback(async () => {
    try {
      const response = await apiClient.post(
        '/api/plaid/create_link_token',
        {},
        { headers: { Authorization: `Bearer ${authContext?.userToken}` } }
      );
      setLinkToken(response.data.link_token);
    } catch (error: any) {
      if (error.response) {
        const serverError = error.response.data;
        webAlert(
          `[Server Error: ${error.response.status}]`,
          `Message: ${serverError.message || 'Details not available'}`
        );
      } else {
        webAlert('Network Error', 'Could not connect to the server.');
      }
      router.back();
    }
  }, [authContext?.userToken, router]);

  useEffect(() => {
    createLinkToken();
  }, [createLinkToken]);

  const onLinkSuccess = useCallback(
    async (public_token: string) => {
      try {
        await apiClient.post(
          '/api/plaid/get_access_token',
          { public_token },
          { headers: { Authorization: `Bearer ${authContext?.userToken}` } }
        );

        // 짧은 폴링(웹훅 없이 동기화 확인)
        const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
        let ok = false;
        for (let i = 0; i < 5; i++) {
          const r = await apiClient.get('/api/transactions', {
            headers: { Authorization: `Bearer ${authContext?.userToken}` },
          });
          if (Array.isArray(r.data) && r.data.length > 0) {
            ok = true;
            break;
          }
          await sleep(2500);
        }

        webAlert(
          'Success!',
          ok
            ? '계좌 연결 및 거래 동기화 완료!'
            : '계좌 연결 완료. 거래 준비 중이라 잠시 후 새로고침 해주세요.'
        );

        router.back();
      } catch {
        webAlert('Error', 'Failed to exchange Access Token.');
      }
    },
    [router, authContext?.userToken]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,      
    onSuccess: onLinkSuccess,
    onExit: () => router.back(),
  });

  const loading = !linkToken || !ready;

  return (

    <GradientBackground>
      <Screen>
                <View style={styles.centerWrap}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.badge}>Bank Link</Text>
            <Text style={styles.title}>Connect your bank</Text>
            <Text style={styles.subtitle}>
              Securely link your bank account to start importing transactions.
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Content */}
          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color="#FBCBC9" />
                <Text style={styles.loadingText}>Connecting to Plaid…</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => open()}
                disabled={!ready}
                activeOpacity={0.9}
                style={[styles.cta, !ready && { opacity: 0.6 }]}
              >
                <LinearGradient
                  colors={['#FBCBC9', '#93A9D1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaBg}
                >
                  <Text className='font-flex text-brand-dim' style={styles.ctaText}>Securely Link Account</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <Text style={styles.helper}>
              You’ll be redirected to your bank’s secure login. We never store your credentials.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.powered}>Powered by Plaid</Text>
            <TouchableOpacity style={styles.ghostBtn} onPress={() => router.back()} activeOpacity={0.8}>
              <Text style={styles.ghostBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
      </Screen>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    minHeight: '100vh' as unknown as number,
    overflow: 'hidden',
    backgroundColor: '#0E0F12',
  },
  gradient: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
  },
  centerWrap: {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh' as unknown as number,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: 'rgba(10, 9, 10, 0.21)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderRadius: 16,
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
  },
  cardHeader: {
    paddingTop: 22,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#fafafa',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(143, 45, 42, 0.15)',
    borderColor: 'rgba(124, 30, 27, 0.35)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    marginTop: 0,
    marginBottom: 0,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 10,
    // 그라디언트 라인은 LinearGradient로 감싸는 게 정석이지만 간단히 색 혼합
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 22,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as unknown as number, // RN엔 gap이 없어서 필요 시 margin으로 조정
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  cta: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaBg: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
  },
  ctaText: {
    color: '#1a1a1a',
    fontWeight: '800',
    fontSize: 16,
  },
  ctaArrow: {
    color: '#1a1a1a',
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 8,
    transform: [{ translateY: -1 }],
  },
  helper: {
    marginTop: 12,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  footerRow: {
    borderTopColor: 'rgba(255,255,255,0.12)',
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  powered: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  ghostBtn: {
    borderColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ghostBtnText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default PlaidLinkScreen;
