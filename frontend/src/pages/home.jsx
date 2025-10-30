import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import NotificationBanner from '../components/NotificationBanner';
import TabNavigation from '../components/TabNavigation';
import GameCard from '../components/GameCard';
import { WalletContext } from '../context/WalletContext';
import '../styles/Home.css';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const { balance } = useContext(WalletContext);

  const games = [
    { id: 1, name: 'FREE FIRE CLASH SQUAD', image: '/games/freefire.jpg', category: 'Esports' },
    { id: 2, name: 'TEAM DEATHMATCH', image: '/games/team.jpg', category: 'Esports' },
    { id: 3, name: 'PUBG MOBILE LITE', image: '/games/pubg.jpg', category: 'Esports' },
    { id: 4, name: 'VALORANT', image: '/games/valorant.jpg', category: 'Esports' },
    { id: 5, name: 'LUDO', image: '/games/ludo.jpg', category: 'Games' },
    { id: 6, name: 'RUMMY', image: '/games/rummy.jpg', category: 'Games' },
  ];

  const topPlayers = [
    { name: 'Rajkamal Meena', winnings: '₹6812331.00', game: 'Ludo' },
    { name: 'Alok Kumar Swain', winnings: '₹2344334.00', game: 'Fan Battle' },
    { name: 'Rohit Singh', winnings: '₹1876543.00', game: 'Cricket Quiz' },
  ];

  const filteredGames = activeTab === 'All' 
    ? games 
    : games.filter(game => game.category === activeTab);

  return (
    <div className="home-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        <Header 
          balance={balance} 
          onMenuClick={() => setSidebarOpen(true)} 
        />
        
        <NotificationBanner 
          message="You can now withdraw your funds. We are excited to share that we have smoothly transferred your balance from deposit wallet to winnings wallet."
        />
        
        <TabNavigation 
          tabs={['All', 'Games', 'Cricket', 'Esports']}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="games-grid">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        <div className="top-khiladis-section">
          <h2>🏆 TOP KHILADIS</h2>
          <div className="top-players">
            {topPlayers.map((player, index) => (
              <div key={index} className="player-card">
                <div className="player-avatar"></div>
                <div className="player-info">
                  <h3>{player.name}</h3>
                  <p className="winnings">Won</p>
                  <p className="amount">{player.winnings}</p>
                  <p className="game-name">By Playing {player.game}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;