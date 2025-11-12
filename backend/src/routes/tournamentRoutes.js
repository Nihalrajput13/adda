import express from 'express';
const router = express.Router();

// Import both controller functions
import { getTournamentsByGame, joinTournament } from '../controllers/tournamentController.js';

// Import your auth middleware
import { authMiddleware } from '../middleware/auth.js';

// GET /api/tournaments/game/:slug
router.get('/game/:slug', authMiddleware, getTournamentsByGame);

// --- THIS IS THE NEW ROUTE ---
// POST /api/tournaments/join
router.post('/join', authMiddleware, joinTournament);

export default router;