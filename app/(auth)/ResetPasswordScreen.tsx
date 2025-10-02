// app/(auth)/ResetPasswordScreen.tsx
import Screen from '@/components/Screen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import apiClient from '../../api';
import GradientBackground from '../../components/GradientBackground';
import Button from "../../components/ui/Button";


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
    <GradientBackground>
      <Screen>
        <TouchableWithoutFeedback>
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>EmoBudget</Text>
            <Text className='font-flex text-base text-white text-center my-10 tracking-widest'> My smart budget tracker </Text>
            <View className='w-0 h-20 border-r border-r-white mb-10'></View>
            
            <Text className='font-flexBold text-3xl text-bold text-white text-center mb-5 tracking-widest' >Reset Password</Text>
            <Text className='font-flex text-brand-dim font-bold text-center my-10 tracking-widest'>Enter the 6-digit code sent to {email}</Text>
            <TextInput className='focus:outline-none' style={styles.input} placeholder="6-digit code" value={code}
              onChangeText={setCode} keyboardType="number-pad" maxLength={6} textAlign="center" />
            <TextInput className='focus:outline-none' style={styles.input} placeholder="New Password" value={newPassword}
              onChangeText={setNewPassword} secureTextEntry />
            <TextInput className='focus:outline-none' style={styles.input} placeholder="Confirm Password" value={confirm}
              onChangeText={setConfirm} secureTextEntry />

              <Button label="Reset Password" onPress={handleReset} />
   
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Screen>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
  },
  title: { 
    fontSize: 40,          
    fontWeight: "bold",
    color: "#fff", 
    textAlign: "center",
    marginBottom: 0,
    textShadowColor: "rgba(255, 255, 255, 0.9)", 
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    marginTop:120 
  },
  input: { 
    width: 350, 
    height: 50, 
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    color: "#fff",              
    paddingVertical: 8,
    marginBottom: 20,
    fontSize:20,
  },
});

export default ResetPasswordScreen;
