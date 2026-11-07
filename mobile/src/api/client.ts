import axios from 'axios';
import { Platform } from 'react-native';

// Production Render backend live URL + localhost fallback for development
export const API_BASE_URL = 'https://hemabridge.onrender.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 seconds to gracefully handle Render free-tier wake-up
});

let currentAuthToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  currentAuthToken = token;
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};
