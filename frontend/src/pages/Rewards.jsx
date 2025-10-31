import React, { useContext, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const Rewards = () => {
  const { balance } = useContext(WalletContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const rewards = [
    { id: 1, title: 'Daily Login Bonus', points: 10, status: 'claimed' },
    { id: 2, title: 'First Deposit Bonus', points: 100, status: 'available' },
    { id: 3, title: 'Refer a Friend', points: 50, status: 'available' },
    { id: 4, title: 'Play 5 Games', points: 25, status: 'locked' },
  ];

  return (
    <div className="page-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header balance={balance} onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="page-content">
        <h2>Rewards & Offers</h2>
        
        <div className="rewards-points">
          <h3>Your Reward Points</h3>
          <h1>0 Points</h1>
        </div>

        <div className="rewards-list">
          {rewards.map((reward) => (
            <div key={reward.id} className="reward-card">
              <div className="reward-info">
                <h4>{reward.title}</h4>
                <p>{reward.points} Points</p>
              </div>
              <button 
                className={`btn-reward ${reward.status}`}
                disabled={reward.status !== 'available'}
              >
                {reward.status === 'claimed' ? 'Claimed' : 
                 reward.status === 'locked' ? 'Locked' : 'Claim'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Rewards;
