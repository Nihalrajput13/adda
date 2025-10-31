import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WalletContext } from '../context/WalletContext';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const KYC = () => {
  const { user } = useContext(AuthContext);
  const { balance } = useContext(WalletContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    panNumber: '',
    aadharNumber: '',
    dateOfBirth: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('KYC details submitted for verification!');
  };

  return (
    <div className="page-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header balance={balance} onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="page-content">
        <h2>KYC Verification</h2>
        
        <div className="kyc-status">
          <p>Status: <span className="status-pending">Pending</span></p>
        </div>

        <form className="kyc-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name (as per ID)</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label>PAN Number</label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="Enter PAN number"
              maxLength="10"
              required
            />
          </div>

          <div className="form-group">
            <label>Aadhar Number</label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              placeholder="Enter Aadhar number"
              maxLength="12"
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Submit for Verification
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export default KYC;
