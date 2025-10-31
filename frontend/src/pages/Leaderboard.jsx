import React, { useContext, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const Leaderboard = () => {
  const { balance } = useContext(WalletContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');

  const players = [
    { rank: 1, name: 'Rajkamal Meena', score: 9850, winnings: '₹125,000' },
    { rank: 2, name: 'Alok Kumar', score: 8920, winnings: '₹98,000' },
    { rank: 3, name: 'Priya Sharma', score: 7845, winnings: '₹76,500' },
    { rank: 4, name: 'Rohit Singh', score: 6920, winnings: '₹54,200' },
    { rank: 5, name: 'Amit Patel', score: 5840, winnings: '₹42,800' },
  ];

  return (
    <div className="page-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header balance={balance} onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="page-content">
        <h2>Leaderboard</h2>
        
        <div className="leaderboard-tabs">
          <button 
            className={activeTab === 'daily' ? 'active' : ''}
            onClick={() => setActiveTab('daily')}
          >
            Daily
          </button>
          <button 
            className={activeTab === 'weekly' ? 'active' : ''}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly
          </button>
          <button 
            className={activeTab === 'monthly' ? 'active' : ''}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly
          </button>
        </div>

        <div className="leaderboard-list">
          {players.map((player) => (
            <div key={player.rank} className="leaderboard-item">
              <div className="player-rank">
                {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
              </div>
              <div className="player-info">
                <h4>{player.name}</h4>
                <p>Score: {player.score}</p>
              </div>
              <div className="player-winnings">
                {player.winnings}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Leaderboard;
