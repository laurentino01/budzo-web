import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Get base URL from environment variable or fallback to development URL
// In production, this should be https://api.budzo.app/v1
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // In a real app, you might get this from cookies or localStorage
    // For this MVP, we'll assume it's stored in localStorage for client-side access
    // or handled via HttpOnly cookies (which Axios sends automatically if withCredentials is true)
    
    // Example using localStorage if not using HttpOnly cookies:
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('budzo_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Errors (401, etc)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      
      console.error(`[API Error ${status}]:`, data);

      // Handle Unauthorized
      if (status === 401) {
        // Redirect to login or dispatch logout action
        if (typeof window !== 'undefined') {
          // window.location.href = '/login'; 
          // Better to use a store action or event emitter to avoid hard reload
          console.warn('Unauthorized access. Session may be expired.');
        }
      }
    }
    return Promise.reject(error);
  }
);
