import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService"; // keep your service
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    referralCode: ""
  });
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedAge, setCheckedAge] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const logoSrc = "/khiladi-adda-logo.png"; // expects file in frontend/public/

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!form.name || !form.phone || !form.email || form.phone.length !== 10 || !checkedTerms || !checkedAge) {
    setError('Please fill all required fields and check both boxes.');
    return;
  }

  setLoading(true);
  try {
    console.log('Sending OTP to', form.phone);
    const sendRes = await authService.sendOTP(form.phone);

    console.log('sendOTP response', sendRes);

    if (sendRes && sendRes.message) {
      // Save pending registration to sessionStorage or context
      sessionStorage.setItem('pendingRegistration', JSON.stringify(form));
      // navigate to OTP verification route
      navigate('/verify-otp');
    } else {
      setError(sendRes.message || 'Failed to send OTP');
    }
  } catch (err) {
    console.error('sendOTP error', err);
    setError(err?.response?.data?.message || err?.message || 'Failed to send OTP');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="register-page">
      <div className="register-top">
        <img src={logoSrc} alt="Khiladi Adda" className="register-logo" />
      </div>

      <form className="register-card" onSubmit={handleSubmit} noValidate>
        <h2 className="register-title">Create an Account</h2>

        <div className="input-group">
          <label className="input-label">
            <span className="icon">👤</span>
            <input
              className="input-field"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              autoComplete="off"
            />
          </label>
        </div>

        <div className="input-group">
          <label className="input-label">
            <span className="icon">📞</span>
            <input
              className="input-field"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Mobile Number"
              maxLength={10}
              autoComplete="off"
            />
          </label>
        </div>

        <div className="input-group">
          <label className="input-label">
            <span className="icon">✉️</span>
            <input
              className="input-field"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              autoComplete="off"
            />
          </label>
        </div>

        <div className="input-group">
          <label className="input-label">
            <span className="icon">🔗</span>
            <input
              className="input-field"
              type="text"
              name="referralCode"
              value={form.referralCode}
              onChange={handleChange}
              placeholder="Referral Code (Optional)"
              autoComplete="off"
            />
          </label>
        </div>

        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={checkedTerms}
              onChange={() => setCheckedTerms(!checkedTerms)}
            />
            <span className="checkbox-custom" />
            <span className="checkbox-text">
              Please check{" "}
              <Link to="/terms" className="link-inline">Terms &amp; Condition and Legality &amp; Responsible Gaming &amp; Privacy Policy</Link>{" "}
              to further proceed
            </span>
          </label>
        </div>

        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={checkedAge}
              onChange={() => setCheckedAge(!checkedAge)}
            />
            <span className="checkbox-custom" />
            <span className="checkbox-text">
              I'm 18 years old and I understand that under-age use of this app may be illegal. I agree to complete my KYC before the first cash withdrawal on the app.
            </span>
          </label>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button className="btn-next" type="submit" disabled={loading}>
          {loading ? "Registering..." : "NEXT"}
        </button>

        <div className="existing-user">
          <span>Existing User? </span>
          <Link to="/login" className="login-link">Login Now</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
