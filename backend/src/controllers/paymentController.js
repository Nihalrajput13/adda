import axios from 'axios';
import { URLSearchParams } from 'url';
import Transaction from '../models/transaction.js'; 
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';

const PAY0_API_URL = 'https://pay0.shop/api';

/**
 * @desc    Create a new payment order
 * @route   POST /api/payment/create-order
 */
export const createOrder = async (req, res) => {
  const PAY0_USER_TOKEN = process.env.PAY0_SHOP_USER_TOKEN;

  if (!PAY0_USER_TOKEN || PAY0_USER_TOKEN === 'your_api_key_from_pay0_shop') {
    console.error('--- PAYMENT ERROR: PAY0_SHOP_USER_TOKEN is not set in .env file ---');
    return res.status(500).json({ message: 'Payment service is not configured.' });
  }

  const { amount } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // --- THIS IS THE FIX ---
    // 1. Create a simple, numeric order_id just like the API example
    const simple_order_id = Date.now().toString(); 
    // ---

    const newTransaction = new Transaction({
      user: userId,
      amount: Number(amount),
      status: 'pending', 
      type: 'deposit',   
      description: 'Wallet top-up via pay0.shop',
      // 2. Save our new simple, numeric ID in the 'order_id' field
      order_id: simple_order_id 
    });
    await newTransaction.save();

    const post_data = new URLSearchParams();
    post_data.append('customer_mobile', user.phone);
    post_data.append('customer_name', user.name);
    post_data.append('user_token', PAY0_USER_TOKEN); 
    post_data.append('amount', Number(amount));
    // 3. Send the new simple, numeric ID to the API
    post_data.append('order_id', simple_order_id);
    post_data.append('redirect_url', 'https://pay0.shop');
    post_data.append('remark1', `Wallet top-up for ${user.email}`);
    post_data.append('remark2', `internal_id=${newTransaction._id.toString()}`); // We can still track our internal ID

    // --- NEW LOGGING ---
    console.log('--- Sending to pay0.shop ---');
    console.log('Data:', post_data.toString());
    // ---

    const response = await axios.post(`${PAY0_API_URL}/create-order`, post_data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    let responseData = response.data;
    if (typeof responseData === 'string') {
      console.log('--- Received non-JSON response from pay0.shop ---');
      console.log('Raw Response:', responseData);
      try { 
        responseData = JSON.parse(responseData); 
      } catch (e) {
        throw new Error(`Received an invalid response (HTML or blank) from payment gateway. Raw data: "${responseData.substring(0, 100)}..."`);
      }
    }

    if (responseData && responseData.status === true) {
      // We don't need to save their orderId, we already have our own.
      res.status(200).json({ payment_url: responseData.result.payment_url });
    } else {
      throw new Error(responseData.message || 'Failed to create order. Check API Key.');
    }
  } catch (error) {
    console.error('--- Error Creating Payment Order ---');
    console.error('Error Message:', error.message); 
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data); 
    }
    console.error('------------------------------------');
    
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * @desc    Check payment status
 * @route   POST /api/payment/check-status
 */
export const checkOrderStatus = async (req, res) => {
  const PAY0_USER_TOKEN = process.env.PAY0_SHOP_USER_TOKEN;

  if (!PAY0_USER_TOKEN || PAY0_USER_TOKEN === 'your_api_key_from_pay0_shop') {
    return res.status(500).json({ message: 'Payment service is not configured.' });
  }

  const { txn_id } = req.body; // This is our *internal* _id
  
  try {
    // 1. Find our transaction by our internal _id
    const transaction = await Transaction.findById(txn_id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(200).json({ status: transaction.status, amount: transaction.amount });
    }

    const post_data = new URLSearchParams();
    post_data.append('user_token', PAY0_USER_TOKEN);
    // --- THIS IS THE FIX ---
    // 2. Send the 'order_id' (the numeric one) that we saved
    post_data.append('order_id', transaction.order_id); 
    // ---

    const response = await axios.post(`${PAY0_API_URL}/check-order-status`, post_data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (response.data && response.data.status === true) {
      const { txnStatus, amount, utr } = response.data.result;
      
      let newStatus = 'pending';
      if (txnStatus.toLowerCase() === 'success') newStatus = 'completed'; 
      if (txnStatus.toLowerCase() === 'failed') newStatus = 'failed';

      transaction.status = newStatus;
      if (newStatus === 'completed') {
        transaction.utr = utr;
        await Wallet.findOneAndUpdate(
          { user: transaction.user },
          { $inc: { balance: Number(amount) } },
          { upsert: true }
        );
      }
      await transaction.save();
      
      return res.status(200).json({ status: newStatus, amount: amount });
      
    } else {
      throw new Error(response.data.message || 'Failed to check status');
    }

  } catch (error) {
    console.error('Error checking status:', error.response?.data || error.message);
    res.status(500).json({ message: error.response?.data?.message || 'Server error' });
  }
};

/**
 * @desc    Webhook receiver for pay0.shop
 * @route   POST /api/payment/webhook
 */
export const handleWebhook = async (req, res) => {
  const { status, order_id, amount, utr } = req.body;
  console.log('Webhook received:', req.body);

  try {
    // --- THIS IS THE FIX ---
    // 1. Find the transaction using the 'order_id' (the numeric one)
    const transaction = await Transaction.findOne({ order_id: order_id });
    // ---

    if (!transaction) {
      console.warn(`Webhook: Transaction not found with order_id: ${order_id}`);
      return res.status(404).send('Transaction not found');
    }
    
    if (transaction.status !== 'pending') {
      return res.status(200).send('Already processed');
    }

    if (status && status.toLowerCase() === 'success') {
      transaction.status = 'completed'; 
      transaction.utr = utr;
      await transaction.save();

      await Wallet.findOneAndUpdate(
        { user: transaction.user },
        { $inc: { balance: Number(amount) } },
        { upsert: true }
      );
    } else if (status && status.toLowerCase() === 'failed') {
      transaction.status = 'failed';
      await transaction.save();
    }
    
    res.status(200).send('Webhook processed');

  } catch (error) {
    console.error('Error in webhook:', error.message);
    res.status(500).send('Server error');
  }
};