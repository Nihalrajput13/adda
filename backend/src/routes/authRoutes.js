import express from 'express';
import { sendOTP, verifyOTP, getCurrentUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
//router.post('/register', register);
router.get('/me', authMiddleware, getCurrentUser);

export default router;