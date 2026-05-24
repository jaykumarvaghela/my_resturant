import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this to your backend URL
// For Android emulator: http://10.0.2.2:3001
// For iOS simulator: http://localhost:3001
// For physical device: http://YOUR_IP:3001
const API_BASE_URL = 'http://10.0.2.2:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = Bearer ${token};
  }
  return config;
});

// Auth
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  const { token, user } = response.data;
  await AsyncStorage.setItem('auth_token', token);
  return { token, user };
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

// Menu
export const getMenuItems = async () => {
  const response = await api.get('/api/menu');
  return response.data;
};

// Orders
export const getOrders = async () => {
  const response = await api.get('/api/orders');
  return response.data;
};

export const createOrder = async (items, totalPrice) => {
  const response = await api.post('/api/orders', { items, totalPrice });
  return response.data;
};

// Logout
export const logout = async () => {
  await AsyncStorage.removeItem('auth_token');
};