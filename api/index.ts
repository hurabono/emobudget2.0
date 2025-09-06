// api/index.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://emobudget-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;