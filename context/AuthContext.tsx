// context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import apiClient from '../api';

// Define the shape of the context data
interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  // 1. Add types for email and password here
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with an initial value of null
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Add types for the function parameters here as well
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/auth/signin', { email, password });
      const token = response.data.token;
      setUserToken(token);
      await AsyncStorage.setItem('userToken', token);
    } catch (e: any) {
      throw new Error(e.response?.data || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    } catch (e) {
      console.log('isLoggedIn error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, userToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};