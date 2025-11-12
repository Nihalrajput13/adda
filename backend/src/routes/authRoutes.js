import express from 'express';
const router = express.Router();

// Import all our new controller functions
import {
  sendOTP,
  registerUser,
  loginWithOTP,
  getCurrentUser
} from '../controllers/authController.js';

// Import the auth middleware (with braces)
import { authMiddleware } from '../middleware/auth.js';


// --- NEW, SEPARATE ROUTES ---

// Public route to send an OTP
router.post('/send-otp', sendOTP);

// Public route to register a new user
router.post('/register', registerUser);

// Public route to log in an existing user
router.post('/login-otp', loginWithOTP);


// --- PROTECTED ROUTE ---

// Private route to get the logged-in user's details
// This is the one that was causing the loop
router.get('/me', authMiddleware, getCurrentUser);


export default router;