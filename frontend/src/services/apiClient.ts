import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor placeholder for attaching authentication JWT
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('cp_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor placeholder for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error.response?.data || error.message);
  }
);
