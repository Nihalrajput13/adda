import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WalletContext } from '../context/WalletContext';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const Stats = () => {
  const { user } = useContext(AuthContext);
  const { balance } = useContext(WalletContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = {
    gamesPlayed: user?.stats?.gamesPlayed || 0,
    gamesWon: user?.stats?.gamesWon || 0,
    totalWinnings: user?.stats?.totalWinnings || 0,
    winRate: user?.stats?.gamesPlayed ? 
      ((user.stats.gamesWon / user.stats.gamesPlayed) * 100).toFixed(1) : 0
  };

  return (
    <div className="page-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header balance={balance} onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="page-content">
        <h2>My Statistics</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <h3>{stats.gamesPlayed}</h3>
            <p>Games Played</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <h3>{stats.gamesWon}</h3>
            <p>Games Won</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <h3>₹{stats.totalWinnings}</h3>
            <p>Total Winnings</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <h3>{stats.winRate}%</h3>
            <p>Win Rate</p>
          </div>
        </div>

        <div className="recent-games">
          <h3>Recent Games</h3>
          <p className="no-data">No recent games to display</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Stats;
