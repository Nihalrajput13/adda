import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WalletContext } from '../context/WalletContext';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const Settings = () => {
  const { logout } = useContext(AuthContext);
  const { balance } = useContext(WalletContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="page-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header balance={balance} onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="page-content">
        <h2>Settings</h2>
        
        <div className="settings-section">
          <h3>Preferences</h3>
          
          <div className="setting-item">
            <label>
              <span>Push Notifications</span>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span>Sound Effects</span>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
              />
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>About</h3>
          <div className="setting-item">
            <p>Version: 1.0.0</p>
          </div>
          <div className="setting-item">
            <a href="#">Terms & Conditions</a>
          </div>
          <div className="setting-item">
            <a href="#">Privacy Policy</a>
          </div>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
