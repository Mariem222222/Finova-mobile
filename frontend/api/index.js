import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authApi = axios.create({
  baseURL: 'http://10.0.2.2:3000/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

export const transactionsApi = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  headers: { 'Content-Type': 'application/json' },
});


transactionsApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
export const getTransactions = async () => {
  try {
    const response = await transactionsApi.get('/transaction');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await authApi.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const registerUser = async (userData) => {
  try {
    const response = await authApi.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const verifyTwoFACode = async (payload) => {
  try {
    const response = await authApi.post('/verify-2fa', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

