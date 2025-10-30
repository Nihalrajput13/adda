import React from 'react';
import '../styles/GameCard.css';

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <div className="game-image">
        <img src={game.image} alt={game.name} onError={(e) => {
          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect fill="%23333" width="200" height="150"/><text fill="%23fff" x="50%" y="50%" text-anchor="middle" dy=".3em">' + game.name + '</text></svg>';
        }} />
      </div>
      <h3 className="game-name">{game.name}</h3>
    </div>
  );
};

export default GameCard;