import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { AuthContext } from '../context/AuthContext';
// We no longer need to import authService directly!
import '../styles/Login.css'; 

const VerifyOTP = () => {
  const navigate = useNavigate();
  // --- This is the fix: We get 'register' from context ---
  const { register } = useContext(AuthContext); 
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('pendingRegistration');
    if (data) {
      setPendingData(JSON.parse(data));
    } else {
      setError('No registration data found. Please register again.');
      setTimeout(() => navigate('/register'), 2000);
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    
    if (!pendingData) {
       setError('Registration data missing. Please start over.');
       return;
    }

    setLoading(true);
    try {
      const registrationData = {
        name: pendingData.name,
        email: pendingData.email,
        phone: pendingData.phone,
        referralCode: pendingData.referralCode,
        otp: otp 
      };

      // --- This is the fix: One single call to register ---
      // This function handles verifying the OTP AND logging the user in.
      await register(registrationData);

      // --- The buggy 'await login(...)' call is GONE. ---

      // Clean up and send to home page
      sessionStorage.removeItem('pendingRegistration');
      navigate('/'); // Success!

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or registration failed');
      setLoading(false);
    }
  };
  
  if (!pendingData) {
    return (
        <div className="login-container">
            <div className="login-card">
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleVerify} className="login-form">
          <h2>Verify Your Number</h2>
          <p className="otp-info">
            Enter the 6-digit OTP sent to +91 {pendingData.phone}
          </p>
          <div className="otp-input-container">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              inputStyle="otp-input"
              containerStyle="otp-container"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Create Account'}
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate('/register')}
          >
            Back to Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;