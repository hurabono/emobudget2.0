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
      await apiClient.post('/api/plaid/get_access_token', {
        public_token: public_token,
      }, {
        headers: { 'Authorization': `Bearer ${authContext?.userToken}` }
      });
      webAlert("Success!", "Your account has been successfully linked.");
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