import express from 'express';
const router = express.Router();

import { 
  getAllPublicTournaments, // This will now import correctly
  getLiveJoinedTournaments,
  getUpcomingJoinedTournaments, 
  getPastJoinedTournaments,
  joinTournament 
} from '../controllers/tournamentController.js';

import { authMiddleware } from '../middleware/auth.js';

// --- THIS IS THE FIX FOR YOUR MAIN TOURNAMENT PAGE ---
router.get('/game/:slug/all', authMiddleware, getAllPublicTournaments);

// --- THESE ARE THE ROUTES FOR "MY LEAGUES" PAGE ---
router.get('/game/:slug/live-joined', authMiddleware, getLiveJoinedTournaments);
router.get('/game/:slug/upcoming-joined', authMiddleware, getUpcomingJoinedTournaments);
router.get('/game/:slug/past-joined', authMiddleware, getPastJoinedTournaments);

// Route for joining a tournament (this stays the same)
router.post('/join', authMiddleware, joinTournament);

export default router;