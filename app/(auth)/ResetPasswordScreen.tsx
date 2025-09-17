// app/(auth)/ResetPasswordScreen.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import apiClient from '../../api';

const ResetPasswordScreen = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const router = useRouter();

  const handleReset = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code.');
      return;
    }
    if (!newPassword || newPassword !== confirm) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    try {
    await apiClient.post('/api/auth/reset-password', { email, code, newPassword });
    router.replace('/LoginScreen?resetSuccess=1');
    } catch (e: any) {
    console.error("RESET ERROR:", e.response?.data, e.response?.status);
    const msg = e.response?.data || e.message || 'Failed to reset password.';
    Alert.alert('Error', msg);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.text}>Enter the 6-digit code sent to {email}</Text>
        <TextInput style={styles.input} placeholder="6-digit code" value={code}
          onChangeText={setCode} keyboardType="number-pad" maxLength={6} textAlign="center" />
        <TextInput style={styles.input} placeholder="New Password" value={newPassword}
          onChangeText={setNewPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Confirm Password" value={confirm}
          onChangeText={setConfirm} secureTextEntry />
        <View style={styles.buttonContainer}>
          <Button title="Reset Password" onPress={handleReset} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 30 },
  text: { fontSize: 16, color: '#666', marginBottom: 10, textAlign: 'center' },
  input: { width: '100%', height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 12, fontSize: 16 },
  buttonContainer: { width: '100%', marginTop: 10 },
});

export default ResetPasswordScreen;
