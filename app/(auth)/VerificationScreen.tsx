import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import apiClient from '../../api';

const VerificationScreen = () => {
  const [code, setCode] = useState('');
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
        Alert.alert("Invalid Code", "Please enter the 6-digit code.");
        return;
    }
    try {
      /* 09092025
       * URL의 쿼리 파라미터 대신, 요청 본문(body)에 email과 code를 담아 보냅니다.
       */
      await apiClient.post('/api/auth/verify-email', { email, code });
      Alert.alert("Success", "Email verification successful. Please log in.", [
          { text: 'OK', onPress: () => router.replace('/LoginScreen') }
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data || "An unexpected error occurred.";
      Alert.alert("Verification Failed", errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.text}>A 6-digit code was sent to {email}.</Text>
        <TextInput style={styles.input} placeholder="6-digit code" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} textAlign="center"/>
        <View style={styles.buttonContainer}>
          <Button title="Verify" onPress={handleVerify} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 40 },
  input: { width: '100%', height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 18 },
  text: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
  buttonContainer: { width: '100%', marginTop: 10 },
});

export default VerificationScreen;