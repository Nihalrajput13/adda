import React from 'react';
import '../styles/NotificationBanner.css';

const NotificationBanner = ({ message }) => {
  return (
    <div className="notification-banner">
      <div className="banner-icon">
        <span>📢</span>
      </div>
      <div className="banner-content">
        <h3>⚠️ Great News</h3>
        <p className="highlight">You can now withdraw your funds✨</p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default NotificationBanner;