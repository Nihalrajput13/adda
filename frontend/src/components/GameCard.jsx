import React from 'react';
import '../styles/HomeGames.css'; // Make sure this path is correct if you moved the CSS

/**
 * This component displays a single game.
 * It now expects `game.iconUrl` and `game.name` from the database.
 */
const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <img src={game.iconUrl} alt={game.name} />
      <span>{game.name}</span>
    </div>
  );
};

export default GameCard;