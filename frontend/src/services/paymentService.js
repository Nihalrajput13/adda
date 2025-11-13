import api from './api.js'; // Your configured axios instance

export const paymentService = {
  /**
   * Asks our backend to create a new payment order.
   * Our backend talks to pay0.shop and returns the payment URL.
   */
  createOrder: async (amount) => {
    const response = await api.post('/payment/create-order', { amount });
    return response.data; // Returns { payment_url: "..." }
  },

  /**
   * Asks our backend to check the status of a transaction.
   * Our backend talks to pay0.shop to get the final status.
   */
  checkOrderStatus: async (txn_id) => {
    const response = await api.post('/payment/check-status', { txn_id });
    return response.data; // Returns { status: "SUCCESS" | "FAILED" | "PENDING" }
  }
};