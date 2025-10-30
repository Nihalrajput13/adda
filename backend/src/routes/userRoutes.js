import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', async (req, res) => {
  // Get user profile
  res.json({ message: 'User profile endpoint' });
});

router.put('/profile', async (req, res) => {
  // Update user profile
  res.json({ message: 'Update profile endpoint' });
});

export default router;