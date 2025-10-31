import React, { useContext, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const Wallet = () => {
  const { balance, transactions, addMoney, withdraw } = useContext(WalletContext);
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState('deposit');

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || amount < 10) {
      alert('Minimum deposit is ₹10');
      return;
    }
    try {
      await addMoney(parseFloat(amount));
      alert('Money added successfully!');
      setAmount('');
    } catch (error) {
      alert('Failed to add money');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!amount || amount < 100) {
      alert('Minimum withdrawal is ₹100');
      return;
    }
    try {
      await withdraw(parseFloat(amount));
      alert('Withdrawal request submitted!');
      setAmount('');
    } catch (error) {
      alert(error.response?.data?.message || 'Withdrawal failed');
    }
  };

  return (
    <div className="page-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header balance={balance} onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="page-content">
        <div className="wallet-balance">
          <h2>Wallet Balance</h2>
          <h1 className="balance-amount">₹{balance || 0}</h1>
        </div>

        <div className="wallet-tabs">
          <button 
            className={activeTab === 'deposit' ? 'active' : ''}
            onClick={() => setActiveTab('deposit')}
          >
            Add Money
          </button>
          <button 
            className={activeTab === 'withdraw' ? 'active' : ''}
            onClick={() => setActiveTab('withdraw')}
          >
            Withdraw
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {activeTab === 'deposit' && (
          <form className="wallet-form" onSubmit={handleDeposit}>
            <div className="form-group">
              <label>Enter Amount (Min ₹10)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="10"
              />
            </div>
            <button type="submit" className="btn-primary">
              Add Money
            </button>
          </form>
        )}

        {activeTab === 'withdraw' && (
          <form className="wallet-form" onSubmit={handleWithdraw}>
            <div className="form-group">
              <label>Enter Amount (Min ₹100)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="100"
              />
            </div>
            <button type="submit" className="btn-primary">
              Withdraw
            </button>
          </form>
        )}

        {activeTab === 'history' && (
          <div className="transaction-history">
            <h3>Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p className="no-transactions">No transactions yet</p>
            ) : (
              <div className="transactions-list">
                {transactions.map((transaction, index) => (
                  <div key={index} className="transaction-item">
                    <div className="transaction-info">
                      <p className="transaction-type">{transaction.type}</p>
                      <p className="transaction-date">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className={`transaction-amount ${transaction.type === 'deposit' ? 'credit' : 'debit'}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Wallet;
