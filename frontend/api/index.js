import axios from 'axios';

export const authApi = axios.create({
  //for android device put your computer address ip  (http://192.168.1.2:3000/api)
  //ipconfig
  //for android emulator put this adress (http://10.0.2.2:3000/api/auth)
  baseURL: 'http://192.168.1.2:3000/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

export const transactionsApi = axios.create({
  baseURL: 'http://192.168.1.2:3000/api',
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

async function getToken() {
  try {
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

export const postTransactions = async (transactionData) => {
  try {
    const response = await transactionsApi.post('/transaction', transactionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export const getUserInfo = async () => {
  try {
    const response = await transactionsApi.get('/user/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteUser = async () => {
  try {
   
    const response = await transactionsApi.delete('/user/delete-acc');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur de suppression');
  }
};
export const changePassword = async (passwordData) => {
  try {
    const response = await transactionsApi.put('/user/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};
export const sendResetEmail = async (data) => {
  try {
    const response = await transactionsApi.post('/user/forgot-password', {
      email: data.email
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to send reset email'
    );
  }
};
export const resetPassword = async (data) => {
  try {
    const response = await transactionsApi.post('/user/reset-password', {
      email: data.email,
      code: data.code,
      newPassword: data.newPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Password reset failed'
    );
  }
};
export const fetchBudgets = async () => {
  try {
    const response = await transactionsApi.get('/budgets');
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export const AddBudgets = async (newBudget) => {
  try {
    const response = await transactionsApi.post('/budgets',newBudget);
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export const ModifyBudget = async (updatedBudget) => {
   try {
  const response = await transactionsApi.put(`/budgets/${updatedBudget._id}`, updatedBudget);
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export const getFinancialRecommendation = async () => {
  try {
    const response = await transactionsApi.get('/recommendations');
    return response.data.cards || []; 
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};
export const getCurrentSavings = async () => {
  try {
    const response = await transactionsApi.get('budgets/current-savings');
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export const getCurrentExpenses = async () => {
  try {
    const response = await transactionsApi.get('transaction/current-expenses');
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export const deleteBudget = async (budgetId) => {
  try {
    const response = await transactionsApi.delete(`/budgets/${budgetId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};






