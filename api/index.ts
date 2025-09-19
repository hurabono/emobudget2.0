// api/index.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://emobudget-server.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("📌 최종 요청:", config.method?.toUpperCase(), config.url);
  console.log("📌 헤더:", config.headers);
  return config;
});

export default apiClient;