import axios from 'axios';
import { refreshAuthToken } from './authService';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Response interceptor to handle token refresh on 401 response
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url.startsWith('/api/v1/email')
    ) {
      originalRequest._retry = true;

      try {
        await refreshAuthToken();

        return axiosInstance(originalRequest);
      } catch (tokenRefreshError) {
        return Promise.reject(tokenRefreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
