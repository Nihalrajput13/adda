import React, { useState, useContext } from 'react';
import { WalletContext } from '../context/WalletContext.jsx';
import { paymentService } from '../services/paymentService.js';
// We should create a simple CSS file for this
// import '../styles/Wallet.css'; 

const Wallet = () => {
  const { balance, fetchBalance } = useContext(WalletContext);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Call our backend to create the order
      const data = await paymentService.createOrder(Number(amount));

      // 2. If successful, redirect to the payment URL
      if (data && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        setError('Could not initiate payment.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start payment');
      setLoading(false);
    }
    // No need for setLoading(false) on success, as we are redirecting
  };

  return (
    <div className="wallet-container" style={styles.container}>
      <h1 style={styles.header}>My Wallet</h1>
      
      <div style={styles.balanceCard}>
        <span style={styles.balanceLabel}>Current Balance</span>
        <span style={styles.balanceAmount}>₹{balance.toFixed(2)}</span>
        <button onClick={fetchBalance} style={styles.refreshButton}>Refresh</button>
      </div>

      <div style={styles.formCard}>
        <form onSubmit={handleAddMoney}>
          <h2 style={styles.formHeader}>Add Money to Wallet</h2>
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.formGroup}>
            <label htmlFor="amount" style={styles.label}>Amount (₹)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              style={styles.input}
            />
          </div>
          
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Processing...' : 'Add Money'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple inline styles to make it look good
const styles = {
  container: { padding: '20px', maxWidth: '600px', margin: '0 auto', color: '#fff' },
  header: { textAlign: 'center', color: '#fff', marginBottom: '20px' },
  balanceCard: { background: '#2c2c2e', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '30px' },
  balanceLabel: { display: 'block', fontSize: '1rem', color: '#aaa', marginBottom: '10px' },
  balanceAmount: { display: 'block', fontSize: '2.5rem', fontWeight: 'bold', color: '#4CAF50', marginBottom: '20px' },
  refreshButton: { background: '#444', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' },
  formCard: { background: '#2c2c2e', padding: '24px', borderRadius: '12px' },
  formHeader: { marginTop: 0, textAlign: 'center', color: '#eee' },
  error: { color: '#e53935', background: '#ffebee', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', color: '#ccc' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #555', background: '#333', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' },
  submitButton: { width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: '#e53935', color: 'white', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }
};

export default Wallet;