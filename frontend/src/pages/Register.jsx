import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService'; // This should point to your API service
import logo from '../assets/khiladi-adda-logo.png'; // Use the logo file path if available

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    referralCode: ''
  });
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedAge, setCheckedAge] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Registration logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      form.phone.length !== 10 ||
      !checkedTerms ||
      !checkedAge
    ) {
      setError('Please fill all required fields and check both boxes.');
      return;
    }

    setLoading(true);
    try {
      // Call your backend registration service
      const res = await authService.register(form);
      if (res.success) {
        // After registration, navigate to login or home
        navigate('/login');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    }
    setLoading(false);
  };

  // Add logic to detect existing logged-in user and redirect if necessary
  // e.g. useAuthContext, or check localStorage for JWT

  return (
    <div className="register-page" style={{ background: '#181010', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
        {/* Logo */}
        <img
          src={logo}
          alt="Khiladi Adda"
          style={{ width: 200, marginBottom: 16, filter: 'drop-shadow(0 0 16px #dc143c)' }}
        />
      </div>
      <form className="register-form" onSubmit={handleSubmit} style={{ maxWidth: 340, margin: '0 auto', padding: 16 }}>
        <h2 style={{ textAlign: 'left', marginBottom: 18 }}>Create an Account</h2>

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label style={{ display: 'block' }}>
            <span style={{ marginRight: 8 }}>👤</span>
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            style={inputStyle}
            autoComplete="off"
          />
        </div>

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label style={{ display: 'block' }}>
            <span style={{ marginRight: 8 }}>📞</span>
            Mobile Number
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Mobile Number"
            style={inputStyle}
            autoComplete="off"
            maxLength={10}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label style={{ display: 'block' }}>
            <span style={{ marginRight: 8 }}>✉️</span>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            style={inputStyle}
            autoComplete="off"
          />
        </div>

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label style={{ display: 'block' }}>
            <span style={{ marginRight: 8 }}>🔗</span>
            Referral Code (Optional)
          </label>
          <input
            type="text"
            name="referralCode"
            value={form.referralCode}
            onChange={handleChange}
            placeholder="Referral Code (Optional)"
            style={inputStyle}
            autoComplete="off"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={checkedTerms}
              onChange={() => setCheckedTerms(!checkedTerms)}
              style={{ marginRight: 8 }}
              required
            />
            Please check <a href="/terms" style={{ color: '#dc143c' }}>Terms & Condition and Legality & Responsible Gaming & Privacy Policy</a> to further proceed
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={checkedAge}
              onChange={() => setCheckedAge(!checkedAge)}
              style={{ marginRight: 8 }}
              required
            />
            I'm 18 years old, understand under-age use may be illegal, and agree to complete KYC before first withdrawal.
          </label>
        </div>

        {error && <div style={{ color: "#dc143c", margin: "12px 0" }}>{error}</div>}

        <div style={{ margin: '16px 0' }}>
          <button
            type="submit"
            style={{ background: '#dc143c', color: '#fff', padding: '12px 0', fontSize: 20, fontWeight: 600, borderRadius: 8, border: 'none', width: '100%' }}
            disabled={loading}
          >
            {loading ? "Registering..." : "NEXT"}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span>Existing User? </span>
          <a href="/login" style={{ color: "#fff", textDecoration: "underline", fontWeight: 600 }}>Login Now</a>
        </div>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #fff",
  background: "#1c1717",
  color: "#fff",
  outline: "none",
  marginTop: "4px",
  fontSize: "16px"
};

export default Register;
