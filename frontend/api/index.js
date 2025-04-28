import axios from 'axios';

export const authApi = axios.create({
  //for android device put your computer address ip  (http://172.16.54.243:3000/api)
  //ipconfig
  //for android emulator put this adress (http://10.0.2.2:3000/api/auth)
  baseURL: 'http://10.0.2.2:3000/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

export const transactionsApi = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const loginUser = async (credentials) => {
  try {
    const response = await authApi.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.log(error)
    throw new error;
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
transactionsApi.interceptors.request.use(async (config) => {
  try {
    // Try different storage solutions if needed
    const token = await getToken();
    console.log('Retrieved token:', token); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to headers:', token.substring(0, 10) + '...');
    } else {
      console.warn('No token found in storage');
    }
  } catch (storageError) {
    console.error('Token retrieval failed:', storageError);
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Unified token getter with fallbacks
async function getToken() {
  try {
    // Option 1: AsyncStorage (standard React Native)
    const asyncStorage = require('@react-native-async-storage/async-storage').default;
    return await asyncStorage.getItem('token');
  } catch (error) {
    console.error('Storage mechanism failed:', error);
    return null;
  }
}
export const getTransactions = async () => {
  try {
    const response = await transactionsApi.get('/transaction');
    return response.data;
  } catch (error) {
    throw error;
  }
};
// In your api/index.js file
export const getUser = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get('/api/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



