import axios from 'axios';

const API_URL = 'http://localhost:8080/api/'; // Replace with your actual API endpoint
const REFRESH_TOKEN_URL = '/api/refresh-token'; // Your API endpoint for refreshing tokens

// Create an axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials:true
  });
  
  // Response interceptor to handle 403 (Unauthorized) error and refresh the token
  api.interceptors.response.use(
    (response) => response, // Return the response as is if no error
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response.status === 403 && !originalRequest._retry) {
        // Token might be expired, try refreshing it
        originalRequest._retry = true;  // Set the retry flag to prevent infinite loop
        try {
          const refreshResponse = await api.post('/auth/refresh-token', {}, { withCredentials: true });
          
          return api(originalRequest);
        } catch (refreshError) {
          // If refreshing the token fails, redirect to login or handle accordingly
          console.error('Token refresh failed', refreshError);
          return Promise.reject(refreshError);
        }
      }
  
      // Return the error if it's not a 403
      return Promise.reject(error);
    }
  );


  export default api;