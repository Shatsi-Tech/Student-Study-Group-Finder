import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://student-study-group-finder-api.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expirations
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if unauthorized on protected routes (not login/register attempts)
    const isAuthEndpoint = error.config && (error.config.url?.includes('/auth/login') || error.config.url?.includes('/auth/register'));
    if (error.response && error.response.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const base = import.meta.env.PROD ? '/Student-Study-Group-Finder' : '';
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = `${base}/login?expired=true`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
