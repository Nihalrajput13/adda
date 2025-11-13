import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING',
  },
  // This is the ID from the pay0.shop API
  order_id: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple nulls, but unique once set
  },
  // This is the UTR from the webhook/status check
  utr: {
    type: String,
  },
  payment_provider: {
    type: String,
    default: 'pay0.shop',
  },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;