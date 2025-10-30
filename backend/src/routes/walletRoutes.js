import express from 'express';
import { getBalance, getTransactions, addMoney, withdrawMoney } from '../controllers/walletController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/balance', getBalance);
router.get('/transactions', getTransactions);
router.post('/add', addMoney);
router.post('/withdraw', withdrawMoney);

export default router;