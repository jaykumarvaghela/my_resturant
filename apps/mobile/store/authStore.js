// Simple auth state manager (without Zustand for simplicity)
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';

let authState = {
  user: null,
  token: null,
  isLoading: false,
};

const listeners = [];

export const subscribe = (listener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

const notifyListeners = () => {
  listeners.forEach(listener => listener(authState));
};

export const getAuthState = () => authState;

export const login = async (email, password) => {
  try {
    authState.isLoading = true;
    notifyListeners();
    
    const { user, token } = await api.login(email, password);
    authState.user = user;
    authState.token = token;
    
    notifyListeners();
    return { success: true, user };
  } catch (error) {
    authState.isLoading = false;
    notifyListeners();
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};

export const logout = async () => {
  try {
    await api.logout();
    authState.user = null;
    authState.token = null;
    notifyListeners();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const checkAuth = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      authState.token = token;
      const user = await api.getCurrentUser();
      authState.user = user;
    }
  } catch (error) {
    await api.logout();
    authState.user = null;
    authState.token = null;
  }
  notifyListeners();
};