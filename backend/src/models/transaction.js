import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'game_win', 'game_loss', 'referral_bonus'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  description: {
    type: String
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }
}, {
  timestamps: true
});

export default mongoose.model('Transaction', transactionSchema);