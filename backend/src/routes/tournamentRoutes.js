import express from 'express';
const router = express.Router();

import { getTournamentsByGame } from '../controllers/tournamentController.js';

// --- THIS IS THE FIX ---
// Change the import to use curly braces { }
import { authMiddleware } from '../middleware/auth.js';

router.get('/game/:slug', authMiddleware, getTournamentsByGame);

export default router;