// app/(auth)/LoginScreen.tsx
import { useRouter,useLocalSearchParams } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, Button, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import { AuthContext } from '../../context/AuthContext';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const { resetSuccess } = useLocalSearchParams<{ resetSuccess?: string }>();

  const handleLogin = async () => {
    try {
      await authContext?.login(email, password);
      // The root layout will handle redirection
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={[styles.formWrapper, isDesktop && styles.formWrapperDesktop]}>
              <Text style={styles.title}>Welcome Back!</Text>
              {/* resetSuccess가 있으면 안내 문구 표시 */}
                {resetSuccess === '1' && (
                  <View style={styles.noticeBox}>
                    <Text style={styles.noticeText}>
                      비밀번호가 변경되었습니다. 다시 로그인 해주세요.
                    </Text>
                  </View>
                )}
              <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
              <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>
              <View style={styles.buttonContainer}>
                <Button title="Login" onPress={handleLogin} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Sign Up" onPress={() => router.push('/SignUpScreen')} color="#888" />
              </View>
              <View style={styles.buttonContainer}>
              <Button title="Forgot Password?" onPress={() => router.push('/ForgotPasswordScreen')} color="#888" />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

// Add your original styles object here...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  formWrapper: { width: '100%', maxWidth: 400 },
  formWrapperDesktop: { backgroundColor: '#fff', padding: 30, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 30 },
  input: { width: '100%', height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
  buttonContainer: { width: '100%', marginTop: 10 },noticeBox: {
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  noticeText: {
    color: '#155724',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  }
});

export default LoginScreen;