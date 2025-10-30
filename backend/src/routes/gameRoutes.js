import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/list', async (req, res) => {
  // Get list of games
  const games = [
    { id: 1, name: 'Ludo', category: 'board' },
    { id: 2, name: 'Quiz', category: 'trivia' },
  ];
  res.json({ games });
});

router.post('/play', authMiddleware, async (req, res) => {
  // Start a game session
  res.json({ message: 'Game started' });
});

export default router;