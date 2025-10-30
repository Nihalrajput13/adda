import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({
      balance: user.wallet.balance,
      depositWallet: user.wallet.depositWallet,
      winningsWallet: user.wallet.winningsWallet
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch balance' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('game', 'name');
    
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

export const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 10) {
      return res.status(400).json({ message: 'Minimum amount is ₹10' });
    }

    const user = await User.findById(req.userId);
    user.wallet.depositWallet += amount;
    user.wallet.balance += amount;
    await user.save();

    await Transaction.create({
      user: req.userId,
      type: 'deposit',
      amount,
      status: 'completed',
      description: `Added ₹${amount} to wallet`
    });

    res.status(200).json({
      message: 'Money added successfully',
      balance: user.wallet.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add money' });
  }
};

export const withdrawMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findById(req.userId);

    if (amount > user.wallet.winningsWallet) {
      return res.status(400).json({ message: 'Insufficient winnings balance' });
    }

    if (amount < 100) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is ₹100' });
    }

    user.wallet.winningsWallet -= amount;
    user.wallet.balance -= amount;
    await user.save();

    await Transaction.create({
      user: req.userId,
      type: 'withdrawal',
      amount,
      status: 'pending',
      description: `Withdrawal of ₹${amount}`
    });

    res.status(200).json({
      message: 'Withdrawal request submitted',
      balance: user.wallet.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Withdrawal failed' });
  }
};