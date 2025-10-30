import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/rewards" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="icon">🎁</span>
        <span className="label">Rewards</span>
      </NavLink>
      <NavLink to="/quizzes" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="icon">📝</span>
        <span className="label">Quizzes</span>
      </NavLink>
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="icon">🏠</span>
        <span className="label">Home</span>
      </NavLink>
      <NavLink to="/winners" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="icon">🏆</span>
        <span className="label">Winners</span>
      </NavLink>
      <NavLink to="/help" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="icon">💬</span>
        <span className="label">Help</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;