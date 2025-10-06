import Screen from '@/components/Screen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import apiClient from '../../api';
import GradientBackground from '../../components/GradientBackground';
import Button from "../../components/ui/Button";


const VerificationScreen = () => {
  const [code, setCode] = useState('');
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const LOGIN_ROUTE = '/LoginScreen';


  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit code.");
      return;
    }
    try {
      await apiClient.post('/api/auth/verify-email', { email, code });

      // 알림만 띄우고, 곧바로 로그인 화면으로 교체 내비게이션
      Alert.alert("Success", "Email verification successful. Please log in.");
      setTimeout(() => {
        router.replace(LOGIN_ROUTE);
      }, 0); // 0~200ms 정도 권장

    } catch (error: any) {
      const errorMessage = error.response?.data || "An unexpected error occurred.";
      Alert.alert("Verification Failed", errorMessage);
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
                
                <Text className='font-flexBold text-3xl text-bold text-white text-center tracking-widest'> Verification </Text>
                <Text className='font-flex text-base text-white text-center mt-10 mb-4 tracking-widest'>Enter Verification Code</Text>
                <Text style={styles.text}>A 6-digit code will send to {email}.</Text>
                <TextInput className='focus:outline-none' style={styles.input} placeholder="6-digit code" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} textAlign="center"/>
                <View style={styles.buttonContainer}>
                  <Button label="Verify" onPress={handleVerify} />
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
  text: { 
    fontSize: 16, 
    color: '#fafafa', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  buttonContainer: { width: '100%', marginTop: 10 },
});

export default VerificationScreen;