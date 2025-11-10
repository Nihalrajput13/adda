import api from './api';

// We now have two clear functions: login and register.
// Both hit the same backend endpoint, but pass different data.

const sendOTP = async (phone) => {
  const response = await api.post('/auth/send-otp', { phone });
  return response.data;
};

/**
 * Logs in an existing user.
 * Only sends phone and OTP.
 */
const login = async ({ phone, otp }) => {
  const payload = { phone, otp };
  const response = await api.post('/auth/verify-otp', payload);
  return response.data; // Returns { token, user }
};

/**
 * Registers a new user.
 * Sends all registration data.
 */
const register = async ({ name, email, phone, otp, referralCode }) => {
  const payload = { name, email, phone, otp, referralCode };
  const response = await api.post('/auth/verify-otp', payload);
  return response.data; // Returns { token, user }
};

const getCurrentUser = async (token) => {
  const response = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// We ONLY use the named export.
// This matches `import { authService } from ...`
export const authService = {
  sendOTP,
  login,      // <-- Renamed from verifyOTP
  register,   // <-- New!
  getCurrentUser,
};