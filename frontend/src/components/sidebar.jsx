import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="profile-section">
          <div className="avatar-circle">
            <img src={user?.avatar || '/default-avatar.png'} alt="Profile" />
          </div>
          <h3>{user?.name || 'User'}</h3>
          <p>{user?.email || user?.phone}</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/profile" onClick={onClose}>
            <span className="icon">👤</span> My Profile
          </Link>
          <Link to="/stats" onClick={onClose}>
            <span className="icon">📊</span> My Stats
          </Link>
          <Link to="/wallet" onClick={onClose}>
            <span className="icon">💰</span> My Wallet & Voucher
          </Link>
          <Link to="/kyc" onClick={onClose}>
            <span className="icon">🔍</span> Update KYC
          </Link>
          <Link to="#" onClick={onClose}>
            <span className="icon">📄</span> TDS Certificate
          </Link>
          <Link to="/leaderboard" onClick={onClose}>
            <span className="icon">📈</span> Leaderboard
          </Link>
          <Link to="/quizzes" onClick={onClose}>
            <span className="icon">🎮</span> My Played Quiz
          </Link>
          <Link to="/referrals" onClick={onClose}>
            <span className="icon">🎁</span> My Referrals
          </Link>
          <Link to="#" onClick={onClose}>
            <span className="icon">💳</span> Deposit Limit
          </Link>
          <Link to="/settings" onClick={onClose}>
            <span className="icon">⚙️</span> Settings
          </Link>
          <Link to="#" onClick={onClose}>
            <span className="icon">🎯</span> Responsible Gaming
          </Link>
          <Link to="/help" onClick={onClose}>
            <span className="icon">❓</span> Tutorial
          </Link>
          <button className="logout-btn" onClick={() => { logout(); onClose(); }}>
            <span className="icon">🚪</span> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;