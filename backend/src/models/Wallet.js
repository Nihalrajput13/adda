import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  // You can add more fields like 'winnings', 'bonus' later
}, { timestamps: true });

const Wallet = mongoose.model('Wallet', WalletSchema);
export default Wallet;