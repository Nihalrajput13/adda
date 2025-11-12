import React, { useState } from 'react';
import '../styles/JoinTournamentModal.css'; // We will create this file next

const JoinTournamentModal = ({ tournament, onClose, onSubmit, loading, error }) => {
  const [inGameUsername, setInGameUsername] = useState('');
  const [inGameUserId, setInGameUserId] = useState('');
  const [gameLevel, setGameLevel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inGameUsername || !inGameUserId || !gameLevel) {
      return; // Simple validation
    }
    onSubmit({
      tournamentId: tournament._id,
      inGameUsername,
      inGameUserId,
      gameLevel: parseInt(gameLevel) // Convert level to a number
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Join {tournament.name}</h2>
          <p>This is a free tournament. Please provide your game details to join.</p>
          
          <div className="form-group">
            <label htmlFor="inGameUsername">In-game Username</label>
            <input
              id="inGameUsername"
              type="text"
              value={inGameUsername}
              onChange={(e) => setInGameUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="inGameUserId">In-game UserID</label>
            <input
              id="inGameUserId"
              type="text"
              value={inGameUserId}
              onChange={(e) => setInGameUserId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gameLevel">Game Level</label>
            <input
              id="gameLevel"
              type="number"
              value={gameLevel}
              onChange={(e) => setGameLevel(e.target.value)}
              placeholder="e.g., 50"
              required
            />
          </div>
          
          {error && <div className="modal-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Joining...' : 'Submit & Join'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinTournamentModal;