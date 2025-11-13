import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { paymentService } from '../services/paymentService.js';
import { WalletContext } from '../context/WalletContext.jsx';

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('VERIFYING'); // VERIFYING, SUCCESS, FAILED
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  
  // Get the wallet context so we can refresh the balance
  const { fetchBalance } = useContext(WalletContext);

  useEffect(() => {
    const txn_id = searchParams.get('txn_id');

    if (!txn_id) {
      setStatus('FAILED');
      setError('No transaction ID found.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const data = await paymentService.checkOrderStatus(txn_id);
        
        if (data.status === 'SUCCESS') {
          setStatus('SUCCESS');
          setAmount(data.amount);
          // Refresh the wallet balance in the context
          fetchBalance(); 
        } else if (data.status === 'PENDING') {
          setStatus('PENDING');
          setError('Payment is still pending. Please wait a few minutes.');
        } else {
          setStatus('FAILED');
          setError('Payment failed or was cancelled.');
        }
      } catch (err) {
        setStatus('FAILED');
setError(err.response?.data?.message || 'Error verifying payment');
      }
    };

    verifyPayment();
  }, [searchParams, fetchBalance]);

  const renderStatus = () => {
    switch (status) {
      case 'VERIFYING':
        return <div style={styles.statusBox}><h3>Verifying Payment...</h3><p>Please wait...</p></div>;
      case 'SUCCESS':
        return (
          <div style={{ ...styles.statusBox, ...styles.success }}>
            <h3>Payment Successful!</h3>
            <p>₹{amount} has been added to your wallet.</p>
          </div>
        );
      case 'FAILED':
        return (
          <div style={{ ...styles.statusBox, ...styles.failed }}>
            <h3>Payment Failed</h3>
            <p>{error}</p>
          </div>
        );
      case 'PENDING':
         return (
          <div style={{ ...styles.statusBox, ...styles.pending }}>
            <h3>Payment Pending</h3>
            <p>{error}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {renderStatus()}
      <Link to="/wallet" style={styles.link}>Back to Wallet</Link>
    </div>
  );
};

// Simple inline styles
const styles = {
  container: { padding: '40px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center', color: '#fff' },
  statusBox: { background: '#2c2c2e', padding: '30px', borderRadius: '12px', marginBottom: '20px' },
  success: { border: '2px solid #4CAF50', color: '#4CAF50' },
  failed: { border: '2px solid #e53935', color: '#e53935' },
  pending: { border: '2px solid #FFC107', color: '#FFC107' },
  link: { textDecoration: 'none', background: '#e53935', color: 'white', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold' }
};

export default PaymentStatusPage;