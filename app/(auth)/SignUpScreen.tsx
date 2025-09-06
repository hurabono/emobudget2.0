// app/(auth)/SignUpScreen.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import apiClient from '../../api';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await apiClient.post('/api/auth/register', { email, password });
      Alert.alert("Verification Code Sent", `A verification code has been sent to ${email}.`);
      router.push({ pathname: '/VerificationScreen', params: { email: email } });
    } catch (error: any) {
      const errorMessage = error.response?.data || "An unexpected error occurred.";
      Alert.alert("Registration Failed", errorMessage);
    }
  };

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Create Account</Text>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <View style={styles.buttonContainer}>
            <Button title="Sign Up" onPress={handleSignUp} />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
  );
};

// Add your original styles object here...
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 40 },
  input: { width: '100%', height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
  buttonContainer: { width: '100%', marginTop: 10 },
});

export default SignUpScreen;