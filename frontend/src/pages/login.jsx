import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    try {
      await authService.sendOTP(phone);
      setStep(2);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await login(phone, otp);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
      setLoading(false);
    }
  };

  // --------- Register Icon/Button -----------
  const handleRegisterClick = () => {
    navigate('/Register');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Khiladi Adda</h1>
          <p>Play Games & Win Real Money</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="login-form">
            <h2>Login with Phone</h2>
            <div className="form-group">
              <label>Phone Number</label>
              <div className="phone-input">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  maxLength="10"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="login-form">
            <h2>Verify OTP</h2>
            <p className="otp-info">Enter the 6-digit OTP sent to +91 {phone}</p>
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
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => { setStep(1); setOtp(''); setError(''); }}
            >
              Change Number
            </button>
          </form>
        )}

        {/* ------- Register Link/CTA -------- */}
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <button
            onClick={handleRegisterClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              color: '#dc143c',
              fontSize: 16,
              cursor: 'pointer',
              fontWeight: 600,
              padding: 0
            }}
          >
            <span style={{
              display: 'inline-block',
              marginRight: 8,
              fontSize: 20
            }}>➕</span>
            New User? Register Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
