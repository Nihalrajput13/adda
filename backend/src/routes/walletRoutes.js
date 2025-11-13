import express from 'express';
// --- Import both controller functions ---
import { getBalance, getTransactions } from '../controllers/walletController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/wallet/balance
router.get('/balance', authMiddleware, getBalance);

// --- THIS IS THE NEW ROUTE THAT FIXES THE 404 ERROR ---
// GET /api/wallet/transactions
router.get('/transactions', authMiddleware, getTransactions);


export default router;