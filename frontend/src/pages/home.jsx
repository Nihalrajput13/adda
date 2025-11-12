/*
* This is the NEW Home.jsx file.
* It fetches games from your backend.
* It does NOT have "Top Khiladis" in it.
*/
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gameService } from "../services/gameService.js"; // Make sure .js is here
import { WalletContext } from "../context/WalletContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import NotificationBanner from "../components/NotificationBanner";
import TabNavigation from "../components/TabNavigation";
import GameCard from "../components/GameCard";
import BottomNav from "../components/BottomNav";

// This is the NEW CSS file you must create
import "../styles/HomeGames.css"; 

const Home = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const { balance } = useContext(WalletContext);

  // States for fetching data from your backend
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This fetches games from your backend when the page loads
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        // This is the API call to your backend
        const data = await gameService.getGames();
        setGames(data.games); // Assumes backend returns { games: [...] }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError(err.message || 'Failed to fetch games');
        if (err.response && err.response.status === 401) {
          // If token is bad, log out user
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [navigate]);

  // Filter games based on the selected tab
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
          message="You can now withdraw your funds. We have transferred your balance from deposit to winnings wallet."
        />
        
        <TabNavigation 
          tabs={['All', 'Games', 'Esports', 'Fanbattle']}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* --- This is the new dynamic section --- */}
        
        {/* 1. Show Loading State */}
        {loading && <div className="loading-spinner">Loading Games...</div>}
        
        {/* 2. Show Error State */}
        {error && <div className="error-message">Error: {error}</div>}
        
        {/* 3. Show Game Grid on Success */}
        {!loading && !error && (
          <div className="games-grid">
            {filteredGames.length > 0 ? (
              filteredGames.map(game => (
                // This links to your new GameDetailPage.jsx
                <Link to={`/games/${game.slug}`} key={game._id} className="game-card-link">
                  <GameCard game={game} />
                </Link>
              ))
            ) : (
              <div className="error-message">No games found for this category.</div>
            )}
          </div>
        )}
        
        {/* The "Top Khiladis" section is removed, as it was in the old file */}
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;