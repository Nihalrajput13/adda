import React from 'react';
import '../styles/Header.css';

const Header = ({ balance, onMenuClick }) => {
  return (
    <header className="app-header">
      <button className="menu-btn" onClick={onMenuClick}>
        <span className="hamburger">☰</span>
      </button>
      <div className="wallet-display">
        <span className="wallet-icon">💰</span>
        <span className="balance">₹{balance || 0}</span>
      </div>
      <button className="notification-btn">
        <span className="bell-icon">🔔</span>
      </button>
    </header>
  );
};

export default Header;