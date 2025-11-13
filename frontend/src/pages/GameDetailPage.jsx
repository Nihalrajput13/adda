import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameService } from '../services/gameService.js';
import JoinTournamentModal from '../components/JoinTournamentModal.jsx';
import '../styles/GameDetailPage.css'; 

const bannerImages = [
  '/banners/banner1.jpg',
  '/banners/banner2.jpg',
  '/banners/banner3.jpg',
];

const GameDetailPage = () => {
  const { slug } = useParams(); 
  const navigate = useNavigate();

  const [game, setGame] = useState(null); 
  const [tournaments, setTournaments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Effect for the slider
  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerImages.length);
    }, 5000); 
    return () => clearInterval(sliderInterval);
  }, []);

  // Effect to get Game Details AND all "Live" tournaments
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return; 

      try {
        setLoading(true);
        setError(null);
        
        const [gameData, tournamentsData] = await Promise.all([
          gameService.getGameBySlug(slug),
          gameService.getAllPublicTournaments(slug) // Use the new public function
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
  }, [slug, navigate]); 

  const handleJoinClick = (tournament) => {
    setSelectedTournament(tournament); 
    if (tournament.entryFee > 0) {
      navigate('/wallet'); 
    } else {
      setModalError(null);
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const data = await gameService.joinTournament(formData);
      alert(data.message); 
      setIsModalOpen(false);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to join. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };
  
  return (
    <>
      <div className="game-detail-page">
        <div className="detail-header">
          <button onClick={() => navigate(-1)} className="back-button">←</button>
          <h1 className="game-title">{game ? game.name : 'Tournaments'}</h1>
          
          {/* --- "MY LEAGUES" BUTTON --- */}
          <button 
            className="my-leagues-button" 
            onClick={() => navigate(`/my-leagues/${slug}`)}
          >
            My Leagues
          </button>
        </div>
        
        {/* Slider */}
        <div className="slider-container">
          <div 
            className="slider-wrapper"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {bannerImages.map((imgUrl, index) => (
              <div className="slider-slide" key={index}>
                <img src={imgUrl} alt={`Banner ${index + 1}`} className="slider-image" />
              </div>
            ))}
          </div>
          <div className="slider-dots">
            {bannerImages.map((_, index) => (
              <span 
                key={index} 
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
        
        <div className="tournament-list">
          {loading && <div className="loading-screen">Loading Tournaments...</div>}
          
          {error && <div className="error-screen">Error: {error}</div>}

          {!loading && !error && (
            <>
              {tournaments.length === 0 ? (
                // --- THIS IS THE FIX ---
                // This message is now accurate
                <div className="no-tournaments">No available tournaments found.</div>
              ) : (
                tournaments.map(tournament => (
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
            </>
          )}
        </div>
      </div>

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