// app/(auth)/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { Alert, Button, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '../../api';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSend = async () => {
  try {
    await apiClient.post('/api/auth/forgot-password', { email });
    // 성공하면 바로 ResetPasswordScreen으로 이동
    router.push(`/ResetPasswordScreen?email=${email}`);
  } catch (e: any) {
    const msg = e.response?.data || e.message || 'Failed to send reset code.';
    Alert.alert('Error', msg);
  }
};


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        
        <Text style={styles.title}>Forgot Password</Text>
        <Text>
        We sent a 6-digit reset code to {email}. Please check your inbox and enter the code below.
        </Text>
        <TextInput style={styles.input} placeholder="Email" value={email}
          onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <View style={styles.buttonContainer}>
          <Button title="Send Reset Code" onPress={handleSend} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 40 },
  input: { width: '100%', height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
  buttonContainer: { width: '100%', marginTop: 10 },
});

export default ForgotPasswordScreen;
