import React, { useContext, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const Winners = () => {
  const { balance } = useContext(WalletContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const winners = [
    { name: 'Rajkamal Meena', game: 'Ludo', amount: '₹6,812,331', date: 'Today' },
    { name: 'Alok Kumar Swain', game: 'Fan Battle', amount: '₹2,344,334', date: 'Yesterday' },
    { name: 'Rohit Singh', game: 'Cricket Quiz', amount: '₹1,876,543', date: '2 days ago' },
    { name: 'Priya Sharma', game: 'Rummy', amount: '₹956,780', date: '3 days ago' },
    { name: 'Amit Patel', game: 'Free Fire', amount: '₹745,234', date: '4 days ago' },
  ];

  return (
    <div className="page-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header balance={balance} onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="page-content">
        <h2>🏆 Recent Winners</h2>
        
        <div className="winners-list">
          {winners.map((winner, index) => (
            <div key={index} className="winner-card">
              <div className="winner-rank">#{index + 1}</div>
              <div className="winner-avatar">
                <div className="avatar-circle"></div>
              </div>
              <div className="winner-info">
                <h4>{winner.name}</h4>
                <p>Won playing {winner.game}</p>
                <span className="winner-date">{winner.date}</span>
              </div>
              <div className="winner-amount">
                <h3>{winner.amount}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Winners;
