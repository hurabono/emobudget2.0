// app/(auth)/SignUpScreen.tsx
import Screen from '@/components/Screen';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import apiClient from '../../api';
import GradientBackground from '../../components/GradientBackground';
import Button from "../../components/ui/Button";

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
      <GradientBackground>
        <Screen>
          <TouchableWithoutFeedback>
            <SafeAreaView style={styles.container}>
              <Text style={styles.title}>EmoBudget</Text>
              <Text className='font-flex text-base text-white text-center my-10 tracking-widest'> My smart budget tracker </Text>
              <View className='w-0 h-20 border-r border-r-white mb-10'></View>
              
              <Text className='font-flexBold text-3xl text-bold text-white text-center mb-5 tracking-widest'> Sign Up </Text>
              <Text className='font-flex text-base text-white text-center my-10 tracking-widest'> Hi here, welcome to emobudget </Text>
              
              <TextInput className='focus:outline-none' style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <TextInput className='focus:outline-none' style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              
              <Link className='text-center' href="/LoginScreen" >
                <Text className="text-brand-dim font-bold font-flex pr-2"> Have you ever seen me before? </Text>
                <Text className="text-brand-dim font-bold font-flex underline"> Log In </Text>
              </Link>

              <View style={styles.buttonContainer}>
                <Button label="Sign Up" onPress={handleSignUp} />
              </View>
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
    marginTop: 50
  },
});

export default SignUpScreen;