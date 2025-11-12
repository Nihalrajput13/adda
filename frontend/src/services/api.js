import axios from 'axios';

// Create the main axios instance
const api = axios.create({
  // Set the base URL for all your backend API routes
  baseURL: 'http://localhost:5000/api' 
});

// --- THIS IS THE CRITICAL FIX ---
// This "interceptor" runs BEFORE every single API request
api.interceptors.request.use(
  (config) => {
    // 1. Get the token from local storage
    const token = localStorage.getItem('token');
    
    // 2. If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Return the modified config so the request can continue
    return config;
  },
  (error) => {
    // Handle any errors that happen during the request setup
    return Promise.reject(error);
  }
);
// 

// Export the configured api instance as the default
export default api;