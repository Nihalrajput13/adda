import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gameService } from '../services/gameService.js';
import TabNavigation from '../components/TabNavigation.jsx';
import '../styles/MyLeaguesPage.css'; // We will create this CSS file

// This is a new, simplified card component for this page
const LeagueCard = ({ tournament }) => (
  <div className="league-card">
    <div className="league-card-header">
      <span className="league-title">{tournament.name}</span>
      <span className="league-fill-status">Filled {tournament.playersJoined}/{tournament.maxPlayers}</span>
    </div>
    <div className="league-card-body">
      <div className="league-info-item">
        <span className="label">Entry</span>
        <span className="value entry">₹{tournament.entryFee.toFixed(2)}</span>
      </div>
      <div className="league-info-item">
        <span className="label">Prizes</span>
        <span className="value prize">₹{tournament.prizePool.toFixed(2)}</span>
      </div>
      <div className="league-info-item">
        <span className="label">Kill Point</span>
        <span className="value kill">₹0.0/Kill</span>
      </div>
    </div>
    <div className="league-card-footer">
      <div className="league-info-item">
        <span className="label">Start Date</span>
        <span className="value">{new Date(tournament.startTime).toLocaleString()}</span>
      </div>
      <div className="league-info-item">
        <span className="label">Total Participants</span>
        <span className="value">{tournament.maxPlayers}</span>
      </div>
      <div className="league-info-item">
        <span className="label">Map</span>
        <span className="value">{tournament.map}</span>
      </div>
    </div>
    {/* You can add a View Leaderboard button here later */}
  </div>
);


const MyLeaguesPage = () => {
  const { slug } = useParams(); 
  const navigate = useNavigate();
  
  const [gameName, setGameName] = useState(slug.replace('-', ' '));
  const [tournaments, setTournaments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- TABS LOGIC ---
  // Default tab is "Upcoming"
  const [activeTab, setActiveTab] = useState('Upcoming'); 

  // Effect to get the Game Name (for the header)
  useEffect(() => {
    gameService.getGameBySlug(slug)
      .then(data => setGameName(data.game.name))
      .catch(() => console.log('Could not fetch game name, using slug'));
  }, [slug]);

  // This effect re-runs every time the 'activeTab' changes
  useEffect(() => {
    const fetchMyTournaments = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);
      setTournaments([]); // Clear old tournaments

      try {
        let fetchFunction;
        // --- THIS IS THE FIX ---
        // 1. Choose which API to call based on the tab
        if (activeTab === 'Live') {
          fetchFunction = gameService.getLiveJoinedTournaments;
        } else if (activeTab === 'Upcoming') {
          fetchFunction = gameService.getUpcomingJoinedTournaments;
        } else if (activeTab === 'Past') {
          fetchFunction = gameService.getPastJoinedTournaments;
        }
        // --- END OF FIX ---

        // 2. Call the chosen function
        const tournamentsData = await fetchFunction(slug);
        setTournaments(tournamentsData.tournaments);

      } catch (err) {
        console.error(`Failed to fetch ${activeTab} tournaments:`, err);
        setError(err.response?.data?.message || `Failed to load ${activeTab} matches`);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTournaments();
  }, [slug, navigate, activeTab]); // Re-run when activeTab changes
  
  return (
    <div className="my-leagues-page">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-button">←</button>
        <h1 className="game-title">My Leagues: {gameName}</h1>
      </div>
      
      {/* --- TABS ORDER FIX --- */}
      <TabNavigation
        tabs={['Live', 'Upcoming', 'Past']} // Order from your image
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="my-leagues-list-content">
        {loading && <div className="loading-screen">Loading My Matches...</div>}
        
        {error && <div className="error-screen">Error: {error}</div>}

        {!loading && !error && (
          <div className="my-leagues-list">
            {tournaments.length === 0 ? (
              <div className="no-tournaments">No {activeTab} matches found.</div>
            ) : (
              tournaments.map(tournament => (
                <LeagueCard key={tournament._id} tournament={tournament} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLeaguesPage;