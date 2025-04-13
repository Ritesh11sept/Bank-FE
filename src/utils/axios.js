import axios from 'axios';

// Create a simplified axios instance with the correct server URL
const instance = axios.create({
  baseURL: 'http://localhost:9000',
  timeout: 15000,
});

// Simple request interceptor for authentication
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
