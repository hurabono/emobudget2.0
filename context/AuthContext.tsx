// context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import apiClient from '../api';

interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/auth/signin', { email, password });
      
      // **FIX: Check for 'accessToken' or 'token' from the server response.**
      const token = response.data.accessToken || response.data.token;

      // **IMPROVEMENT: If no token is found in the response, throw an error.**
      if (!token) {
        throw new Error("Authentication successful, but no token received from server.");
      }

      setUserToken(token);
      await AsyncStorage.setItem('userToken', token);
    } catch (e: any) {
      // **IMPROVEMENT: Provide a more detailed error message for debugging.**
      const errorMessage = e.response?.data?.message || e.message || "An unknown login error occurred.";
      console.error("Login failed:", errorMessage); // Log the detailed error
      throw new Error(errorMessage);
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
      // No need to set isLoading here, it's handled by the initial state
      let token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    } catch (e) {
      console.log('isLoggedIn error', e);
      // Ensure userToken is null if there's an error
      setUserToken(null);
    } finally {
      setIsLoading(false); // Set loading to false after checking
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