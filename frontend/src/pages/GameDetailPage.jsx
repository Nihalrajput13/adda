import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gameService } from '../services/gameService.js';
import '../styles/GameDetailPage.css'; // Make sure you created this CSS file

const GameDetailPage = () => {
  const { slug } = useParams(); // Gets "free-fire" from the URL
  const navigate = useNavigate();

  const [game, setGame] = useState(null); // Stores game details (for header)
  const [tournaments, setTournaments] = useState([]); // Stores tournaments list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return; // Exit if slug is not defined

      try {
        setLoading(true);
        setError(null);

        // Fetch game details and tournaments at the same time
        const [gameData, tournamentsData] = await Promise.all([
          gameService.getGameBySlug(slug),
          gameService.getTournamentsByGame(slug)
        ]);

        // Set state with the results
        setGame(gameData.game);
        setTournaments(tournamentsData.tournaments);

      } catch (err) {
        console.error('Failed to fetch game details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // 1. Loading State
  if (loading) {
    return (
      <div className="game-detail-page">
        <div className="detail-header">
          <button onClick={() => navigate(-1)} className="back-button">←</button>
          <h1 className="game-title">Loading...</h1>
        </div>
        <div className="loading-screen">Loading Tournaments...</div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="game-detail-page">
        <div className="detail-header">
          <button onClick={() => navigate(-1)} className="back-button">←</button>
          <h1 className="game-title">Error</h1>
        </div>
        <div className="error-screen">Error: {error}</div>
      </div>
    );
  }

  // 3. Success State (Main UI)
  return (
    <div className="game-detail-page">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-button">←</button>
        {/* Use the game name from the API call */}
        <h1 className="game-title">{game ? game.name : 'Tournaments'}</h1>
      </div>

      <div className="tournament-list">
        {tournaments.length === 0 ? (
          <div className="no-tournaments">No tournaments found for this game.</div>
        ) : (
          tournaments.map(tournament => (
            // We can make this Link work later
            <Link to="#" key={tournament._id} className="tournament-card">
              <div className="card-header">
                <span className="tournament-name">{tournament.name}</span>
                <span className="tournament-map">{tournament.map}</span>
              </div>
              <div className="card-body">
                <div className="prize-pool">
                  <span className="label">Prize Pool</span>
                  <span className="value">₹{tournament.prizePool}</span>
                </div>
                <div className="entry-fee">
                  <span className="label">Entry</span>
                  <span className="value-fee">
                    {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
                  </span>
                </div>
              </div>
              <div className="card-footer">
                <div className="player-count">
                  <div className="player-bar">
                    <span 
                      className="player-fill" 
                      style={{ width: `${(tournament.playersJoined / tournament.maxPlayers) * 100}%` }}
                    ></span>
                  </div>
                  <span className="count-text">{tournament.playersJoined} / {tournament.maxPlayers}</span>
                </div>
                <span className="tournament-type">{tournament.type}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default GameDetailPage;