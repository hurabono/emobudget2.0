// app/(app)/PlaidLinkScreen.web.tsx
import { useRouter } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import apiClient from '../../api';
import { AuthContext } from '../../context/AuthContext';

// Web alert function
const webAlert = (title: string, message: string) => {
  alert(`${title}\n${message}`);
};

const PlaidLinkScreen = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const createLinkToken = useCallback(async () => {
    try {
      const response = await apiClient.post('/api/plaid/create_link_token', {}, {
        headers: { 'Authorization': `Bearer ${authContext?.userToken}` }
      });
      setLinkToken(response.data.link_token);
    } catch (error: any) {
      if (error.response) {
        const serverError = error.response.data;
        webAlert(`[Server Error: ${error.response.status}]`, `Message: ${serverError.message || 'Details not available'}`);
      } else {
        webAlert("Network Error", "Could not connect to the server.");
      }
      router.back();
    }
  }, [authContext?.userToken, router]);

  useEffect(() => {
    createLinkToken();
  }, [createLinkToken]);

  const onLinkSuccess = useCallback(async (public_token: string) => {
  try {
    await apiClient.post('/api/plaid/get_access_token', { public_token }, {
      headers: { 'Authorization': `Bearer ${authContext?.userToken}` }
    });

    // ✅ 짧은 폴링(웹훅 없이도 준비 끝날 때까지 2~5번만 확인)
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
    let ok = false;
    for (let i = 0; i < 5; i++) {         // 최대 5회 시도
      const r = await apiClient.get('/api/transactions', {
        headers: { 'Authorization': `Bearer ${authContext?.userToken}` }
      });
      if (Array.isArray(r.data) && r.data.length > 0) { ok = true; break; }
      await sleep(2500); // 2.5초 간격
    }

    webAlert("Success!", ok
      ? "계좌 연결 및 거래 동기화 완료!"
      : "계좌 연결 완료. 거래 준비 중이라 잠시 후 새로고침 해주세요.");

    router.back();
  } catch (error) {
    webAlert("Error", "Failed to exchange Access Token.");
  }
}, [router, authContext?.userToken]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onLinkSuccess,
    onExit: () => router.back(),
  });

  if (!linkToken || !ready) {
    return (
      <div style={styles.container}>
        <p style={styles.infoText}>Connecting to Plaid...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Connect Your Bank</h1>
      <p style={styles.infoText}>Please click the button below to securely connect your bank account.</p>
      <button onClick={() => open()} disabled={!ready} style={styles.button}>
        Securely Link Account
      </button>
    </div>
  );
};

// CSS-in-JS styles for web
const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  infoText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  button: { backgroundColor: '#007AFF', padding: '15px 30px', borderRadius: 8, color: '#fff', fontSize: 18, fontWeight: 'bold', border: 'none', cursor: 'pointer' },
};

export default PlaidLinkScreen;