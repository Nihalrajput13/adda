import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { WalletProvider } from './context/WalletContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx'; // <-- Make sure this import exists
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import Wallet from './pages/Wallet.jsx';
import Stats from './pages/Stats.jsx';
import Quizzes from './pages/Quizzes.jsx';
import Rewards from './pages/Rewards.jsx';
import Winners from './pages/Winners.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Settings from './pages/Settings.jsx';
import KYC from './pages/KYC.jsx';
import Referrals from './pages/Referrals.jsx';
import Help from './pages/Help.jsx';
import VerifyOTP from './pages/VerifyOTP.jsx';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
            <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
            <Route path="/quizzes" element={<PrivateRoute><Quizzes /></PrivateRoute>} />
            <Route path="/rewards" element={<PrivateRoute><Rewards /></PrivateRoute>} />
            <Route path="/winners" element={<PrivateRoute><Winners /></PrivateRoute>} />
            <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/kyc" element={<PrivateRoute><KYC /></PrivateRoute>} />
            <Route path="/referrals" element={<PrivateRoute><Referrals /></PrivateRoute>} />
            <Route path="/help" element={<PrivateRoute><Help /></PrivateRoute>} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
          </Routes>
        </Router>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
