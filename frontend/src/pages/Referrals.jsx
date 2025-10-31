import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WalletContext } from '../context/WalletContext';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const Referrals = () => {
  const { user } = useContext(AuthContext);
  const { balance } = useContext(WalletContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || 'KA12345678';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referrals = [
    { name: 'John Doe', status: 'Active', earnings: '₹500' },
    { name: 'Jane Smith', status: 'Active', earnings: '₹500' },
  ];

  return (
    <div className="page-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header balance={balance} onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="page-content">
        <h2>Referral Program</h2>
        
        <div className="referral-banner">
          <h3>Earn ₹500 per Referral!</h3>
          <p>Invite your friends and earn rewards when they sign up and play</p>
        </div>

        <div className="referral-code">
          <h4>Your Referral Code</h4>
          <div className="code-box">
            <span className="code">{referralCode}</span>
            <button onClick={handleCopy} className="btn-copy">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="referral-stats">
          <div className="stat-box">
            <h3>{referrals.length}</h3>
            <p>Total Referrals</p>
          </div>
          <div className="stat-box">
            <h3>₹{referrals.length * 500}</h3>
            <p>Total Earnings</p>
          </div>
        </div>

        <div className="referrals-list">
          <h4>Your Referrals</h4>
          {referrals.length === 0 ? (
            <p className="no-referrals">No referrals yet</p>
          ) : (
            referrals.map((referral, index) => (
              <div key={index} className="referral-item">
                <div className="referral-info">
                  <h5>{referral.name}</h5>
                  <p className="status">{referral.status}</p>
                </div>
                <p className="earnings">{referral.earnings}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Referrals;
