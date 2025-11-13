import Wallet from '../models/Wallet.js';
import Transaction from '../models/transaction.js'; // Import Transaction model

/**
 * @desc    Get user's wallet balance
 * @route   GET /api/wallet/balance
 */
export const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      wallet = await Wallet.create({ user: userId, balance: 0 });
      console.log(`New wallet created for user: ${userId}`);
    }

    res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    console.error('Error in getBalance:', error.message);
    res.status(500).json({ message: 'Server error fetching balance' });
  }
};

/**
 * --- THIS IS THE NEW FUNCTION THAT FIXES THE 404 ERROR ---
 * @desc    Get all of a user's transactions
 * @route   GET /api/wallet/transactions
 */
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all transactions for this user, sort them by newest first
    const transactions = await Transaction.find({ user: userId })
                                          .sort({ createdAt: -1 }); // Sort by newest
    
    res.status(200).json({ transactions });
  
  } catch (error) {
    console.error('Error in getTransactions:', error.message);
    res.status(500).json({ message: 'Server error fetching transactions' });
  }
};