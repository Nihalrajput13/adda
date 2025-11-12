import express from 'express';
const router = express.Router();

// Import the controller functions
import { getGames, getGameBySlug } from '../controllers/gameController.js';

// Import your auth middleware (with braces)
import { authMiddleware } from '../middleware/auth.js';

// GET /api/games/
// Gets all games for the lobby
router.get('/', authMiddleware, getGames);

// --- THIS IS THE NEW ROUTE THAT FIXES YOUR BUG ---
// GET /api/games/free-fire
// Gets the details for a single game
router.get('/:slug', authMiddleware, getGameBySlug);

export default router;