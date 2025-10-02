// app/(auth)/ForgotPasswordScreen.tsx
import Screen from '@/components/Screen';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import apiClient from '../../api';
import GradientBackground from '../../components/GradientBackground';
import Button from "../../components/ui/Button";


const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSend = async () => {
  try {
    await apiClient.post('/api/auth/forgot-password', { email });
    router.push(`/ResetPasswordScreen?email=${email}`);
  } catch (e: any) {
    const msg = e.response?.data || e.message || 'Failed to send reset code.';
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
            <Text className='font-flexBold text-3xl text-bold text-white text-center mb-5 tracking-widest'>Forgot Password</Text>
            
            <Text className='text-center my-5 text-brand-dim'>
            We sent a 6-digit reset code to {email}. <br/>Please check your inbox and enter the code below.
            </Text>

            <TextInput className='focus:outline-none' style={styles.input} placeholder="Email" value={email}
              onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            
            
            <View style={styles.buttonContainer}>
              <Button label="Send Reset Code" onPress={handleSend} />
            </View>

            <Link className='text-center pt-2 mt-10' href="/LoginScreen" >
              <Text className="text-brand-dim font-bold font-flex pr-2"> Have you ever seen me before? </Text>
              <Text className="text-brand-dim font-bold font-flex underline">Login </Text>
            </Link>

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
    padding: 20
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
  buttonContainer: { 
    width: '100%', 
    marginTop: 10 
  },
});

export default ForgotPasswordScreen;
