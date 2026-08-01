import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching authentication JWT
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

// Response interceptor for clean error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    const errorResponse = error.response?.data;
    let errorMessage = 'Network error or server unavailable';

    if (errorResponse) {
      if (typeof errorResponse === 'string') {
        errorMessage = errorResponse;
      } else if (errorResponse.message) {
        errorMessage = errorResponse.message;
        if (Array.isArray(errorResponse.errors) && errorResponse.errors.length > 0) {
          const detail = errorResponse.errors.map((e: { message?: string } | string) => (typeof e === 'object' && e?.message ? e.message : String(e))).join(', ');
          errorMessage += `: ${detail}`;
        }
      } else if (errorResponse.error) {
        errorMessage = errorResponse.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);
