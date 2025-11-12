import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // <-- This is the corrected line
import { gameService } from '../services/gameService.js';
import JoinTournamentModal from '../components/JoinTournamentModal.jsx'; // Import the new modal
import '../styles/GameDetailPage.css'; 

const GameDetailPage = () => {
  const { slug } = useParams(); 
  const navigate = useNavigate();

  const [game, setGame] = useState(null); 
  const [tournaments, setTournaments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- NEW STATES FOR MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return; 

      try {
        setLoading(true);
        setError(null);
        
        const [gameData, tournamentsData] = await Promise.all([
          gameService.getGameBySlug(slug),
          gameService.getTournamentsByGame(slug)
        ]);

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
  }, [slug, navigate]); // Added navigate to dependency array

  // --- NEW FUNCTION TO HANDLE CLICKING JOIN ---
  const handleJoinClick = (tournament) => {
    setSelectedTournament(tournament); // Store which tournament was clicked
    
    if (tournament.entryFee > 0) {
      // Paid tournament: Redirect to wallet (as you requested)
      navigate('/wallet'); // You can change this to /payment later
    } else {
      // Free tournament: Open the modal
      setModalError(null);
      setIsModalOpen(true);
    }
  };

  // --- NEW FUNCTION TO SUBMIT MODAL ---
  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    setModalError(null);
    try {
      // Call the new service function
      const data = await gameService.joinTournament(formData);
      
      // Success!
      alert(data.message); // Simple success message
      setIsModalOpen(false);
      
      // We should refresh the tournament list to show the new player count
      // For now, we'll just close the modal
      
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to join. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };


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

  return (
    <>
      <div className="game-detail-page">
        <div className="detail-header">
          <button onClick={() => navigate(-1)} className="back-button">←</button>
          <h1 className="game-title">{game ? game.name : 'Tournaments'}</h1>
        </div>

        <div className="tournament-list">
          {tournaments.length === 0 ? (
            <div className="no-tournaments">No tournaments found for this game.</div>
          ) : (
            tournaments.map(tournament => (
              // --- UPDATED CARD: No longer a Link, it's a div ---
              <div key={tournament._id} className="tournament-card">
                <div className="card-header">
                  <span className="tournament-name">{tournament.name}</span>
                  <span className="tournament-map">{tournament.map}</span>
                </div>
                <div className="card-body">
                  <div className="prize-pool">
                    <span className="label">Prize Pool</span>
                    <span className="value">₹{tournament.prizePool}</span>
                  </div>
                  {/* --- UPDATED BUTTON --- */}
                  <button 
                    className="btn-join" 
                    onClick={() => handleJoinClick(tournament)}
                  >
                    {tournament.entryFee === 0 ? 'Join FREE' : `Join ₹${tournament.entryFee}`}
                  </button>
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
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- NEW MODAL RENDER --- */}
      {isModalOpen && selectedTournament && (
        <JoinTournamentModal
          tournament={selectedTournament}
          loading={modalLoading}
          error={modalError}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </>
  );
};

export default GameDetailPage;