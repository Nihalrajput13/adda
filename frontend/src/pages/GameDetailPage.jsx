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

// --- NEW HELPER FUNCTION ---
// This function parses your string: "1=1=100,2=2=60,3=3=40"
// And turns it into: "Rank 1: ₹100, Rank 2: ₹60, Rank 3: ₹40"
const parsePrizeBreakup = (breakupString) => {
  if (!breakupString || typeof breakupString !== 'string') {
    return null;
  }
  
  try {
    return breakupString.split(',') // -> ["1=1=100", "2=2=60", "3=3=40"]
      .map(item => {
        const parts = item.split('='); // -> ["1", "1", "100"]
        
        let rank = parts[0];
        // Check for a rank range (e.g., 2=5=50)
        if (parts.length === 3 && parts[0] !== parts[1]) {
          rank = `${parts[0]}-${parts[1]}`;
        }
        
        const prize = parts[parts.length - 1];
        return `Rank ${rank}: ₹${prize}`; // -> "Rank 1: ₹100"
      })
      .join(', '); // -> "Rank 1: ₹100, Rank 2: ₹60, Rank 3: ₹40"
  
  } catch (error) {
    console.error('Error parsing prize breakup:', error);
    return "Prize breakup format error.";
  }
};
// --- END OF HELPER FUNCTION ---


const GameDetailPage = () => {
  const { slug } = useParams(); 
  const navigate = useNavigate();

  const [game, setGame] = useState(null); 
  const [tournaments, setTournaments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
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

  // Effect to fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return; 

      try {
        setLoading(true);
        setError(null);
        
        const [gameData, tournamentsData] = await Promise.all([
          gameService.getGameBySlug(slug),
          gameService.getAllPublicTournaments(slug) 
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
      setIsJoinModalOpen(true);
    }
  };

  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const data = await gameService.joinTournament(formData);
      alert(data.message); 
      setIsJoinModalOpen(false);
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
                <div className="no-tournaments">No available tournaments found.</div>
              ) : (
                tournaments.map(tournament => {
                  
                  // --- THIS IS THE FIX ---
                  // We parse the string *before* rendering
                  const prizeString = parsePrizeBreakup(tournament.prizeBreakup);
                  // --- END OF FIX ---

                  return (
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

                      {/* --- THIS IS THE NEW PRIZE BREAKUP SECTION --- */}
                      {/* It shows the parsed string in one line */}
                      {prizeString && (
                        <div className="prize-breakup-text">
                          <span className="prize-label">🏆 Prizes:</span> {prizeString}
                        </div>
                      )}
                      {/* --- END OF NEW SECTION --- */}

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
                  )
                })
              )}
            </>
          )}
        </div>
      </div>

      {/* Join Tournament Modal */}
      {isJoinModalOpen && selectedTournament && (
        <JoinTournamentModal
          tournament={selectedTournament}
          loading={modalLoading}
          error={modalError}
          onClose={() => setIsJoinModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </>
  );
};

export default GameDetailPage;