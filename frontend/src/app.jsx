import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { WalletProvider } from './context/WalletContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Stats from './pages/Stats';
import Quizzes from './pages/Quizzes';
import Rewards from './pages/Rewards';
import Winners from './pages/Winners.jsx';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import KYC from './pages/KYC';
import Referrals from './pages/Referrals';
import Help from './pages/Help';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
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
          </Routes>
        </Router>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;