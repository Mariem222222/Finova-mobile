import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api/auth', 
  headers: {
    'Content-Type': 'application/json',
  },
});
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};