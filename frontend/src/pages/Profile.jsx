import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { WalletContext } from '../context/WalletContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { balance } = useContext(WalletContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call API to update profile
    alert('Profile updated successfully!');
  };

  return (
    <div className="page-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header balance={balance} onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="page-content">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={user?.avatar || '/default-avatar.png'} alt="Profile" />
          </div>
          <h2>{user?.name || 'User'}</h2>
          <p>{user?.phone}</p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              disabled
              placeholder="Phone number"
            />
          </div>

          <button type="submit" className="btn-primary">
            Update Profile
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
