import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://nutriscan-hs2o.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Better error messages
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Cannot connect to server. Please check if backend is running on port 5000.';
    }
    
    return Promise.reject(error);
  }
);

export default api;