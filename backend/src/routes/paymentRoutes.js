import express from 'express';
import { createOrder, checkOrderStatus, handleWebhook } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /api/payment/create-order (Protected)
router.post('/create-order', authMiddleware, createOrder);

// POST /api/payment/check-status (Protected)
router.post('/check-status', authMiddleware, checkOrderStatus);

// POST /api/payment/webhook (Public)
// This route is called by pay0.shop, so it has no auth middleware
router.post('/webhook', handleWebhook);

export default router;