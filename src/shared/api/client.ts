import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// API base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - adds auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (zustand persists here)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch {
        // Invalid JSON in storage, ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - unwraps data and handles errors
apiClient.interceptors.response.use(
  (response) => {
    // Backend wraps responses in { data: ..., meta: ... }
    // Unwrap the data property for cleaner frontend usage
    if (response.data && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && originalRequest) {
      // Clear auth state and redirect to login
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - API may be offline');
    }

    return Promise.reject(error);
  }
);

// Helper to extract error message from API response
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Check for validation errors
    if (error.response?.data?.message) {
      const message = error.response.data.message;
      if (Array.isArray(message)) {
        return message.join(', ');
      }
      return message;
    }
    // Check for error field
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    // Network error
    if (!error.response) {
      return 'Unable to connect to server. Please check if the API is running.';
    }
    // Default HTTP error
    return `Request failed: ${error.response.status} ${error.response.statusText}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export default apiClient;
