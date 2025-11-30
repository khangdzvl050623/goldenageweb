import axios from 'axios';

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: '/api', // Use the Vite proxy
});

// Add an interceptor to attach the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
