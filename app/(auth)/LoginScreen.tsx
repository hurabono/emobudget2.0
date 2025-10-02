// app/(auth)/LoginScreen.tsx
import Screen from '@/components/Screen';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import Button from "../../components/ui/Button";
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
    <GradientBackground>
     <Screen>
       <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}>
        <SafeAreaView>
            <TouchableWithoutFeedback >
              <View style={styles.inner}>
                <View>
                  <View className="flex-1 justify-center items-center">
                    <Image
                      source={require("../../assets/images/sun_from_space.png")}
                      className="w-24 h-24"
                    />
                  </View>
                  <Text style={styles.title}>EmoBudget</Text>
                  <Text className='font-flex text-base text-white text-center my-10 tracking-widest'> My smart budget tracker </Text>
                  <View className='w-[50%] h-20 border-r border-r-white mb-10'></View>
                  
                  {/* resetSuccess가 있으면 안내 문구 표시 */}
                    {resetSuccess === '1' && (
                      <View style={styles.noticeBox}>
                        <Text style={styles.noticeText}>
                          Your password has been changed. Please log in again.
                        </Text>
                      </View>
                    )}
                  <TextInput className='focus:outline-none' style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
                  <TextInput className='focus:outline-none' style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>
                  
                    <Link className='text-center' href="/SignUpScreen" >
                     <Text className="text-brand-dim font-bold font-flex pr-2"> We are meeting up first time? </Text>
                     <Text className="text-brand-dim font-bold font-flex underline">Sign Up</Text>
                    </Link>

                  <View style={styles.buttonContainer}>
                    <Button label="Start" onPress={handleLogin} />
                  </View>
                  

                  <Link className='text-center pt-2 mt-10' href="/ForgotPasswordScreen" >
                     <Text className="text-brand-dim font-bold font-flex pr-2"> Opps, forget password? </Text>
                     <Text className="text-brand-dim font-bold font-flex underline">Reset password</Text>
                  </Link>

                </View>
              </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
     </Screen>
    </GradientBackground>
  );
};

// Add your original styles object here...
const styles = StyleSheet.create({
  inner: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  // formWrapper: { 
  //   width: '100%', 
  //   maxWidth: 400 
  // },
  // formWrapperDesktop: { 
  //   marginTop:25,
  //   padding: 30, 
  //   borderRadius: 12, 
  //   shadowColor: '#000', 
  //   shadowOffset: { width: 0, height: 2 }, 
  //   shadowOpacity: 0.1, 
  //   shadowRadius: 8, 
  //   elevation: 3 
  // },
  title: { 
    fontSize: 40,          
    fontWeight: "bold",
    color: "#fff", 
    textAlign: "center",
    marginBottom: 0,
    textShadowColor: "rgba(255, 255, 255, 0.9)", 
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,     
  },
  input: { 
    width: '100%', 
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
    marginTop: 50,
    letterSpacing: 2,
    fontWeight: "900",
  },
  noticeBox: {
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