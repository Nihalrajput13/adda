import api from './api'; // Your axios instance

export const authService = {
  
  /**
   * Calls the backend to send an OTP to a phone number
   */
  sendOTP: async (phone) => {
    // Calls POST /api/auth/send-otp
    const response = await api.post('/auth/send-otp', { phone });
    return response.data;
  },

  /**
   * Calls the new backend registration endpoint
   */
  register: async (userData) => {
    // userData = { name, email, phone, otp, referralCode }
    // Calls POST /api/auth/register
    const response = await api.post('/auth/register', userData);
    return response.data; // Returns { token, user }
  },

  /**
   * Calls the new backend login endpoint
   */
  login: async ({ phone, otp }) => {
    // Calls POST /api/auth/login-otp
    const response = await api.post('/auth/login-otp', { phone, otp });
    return response.data; // Returns { token, user }
  },

  /**
   * Calls the protected "me" route to get user data from a token
   */
  getCurrentUser: async () => {
    // Calls GET /api/auth/me
    // The 'api.js' interceptor automatically adds the token
    const response = await api.get('/auth/me');
    return response.data;
  }
};