import axios from 'axios';
import { Platform } from 'react-native';

// User's LAN IP for Expo Go device testing + localhost fallback for simulator/web
export const API_BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:4000'
    : 'http://172.17.206.44:4000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
