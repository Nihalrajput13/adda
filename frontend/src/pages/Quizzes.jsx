import React, { useContext, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const Quizzes = () => {
  const { balance } = useContext(WalletContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const quizzes = [
    { id: 1, name: 'Cricket Quiz', prize: '₹500', entry: '₹50', players: 120 },
    { id: 2, name: 'Bollywood Quiz', prize: '₹300', entry: '₹30', players: 85 },
    { id: 3, name: 'General Knowledge', prize: '₹1000', entry: '₹100', players: 200 },
    { id: 4, name: 'Sports Quiz', prize: '₹750', entry: '₹75', players: 150 },
  ];

  return (
    <div className="page-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header balance={balance} onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="page-content">
        <h2>Available Quizzes</h2>
        
        <div className="quizzes-list">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-header">
                <h3>{quiz.name}</h3>
                <span className="quiz-prize">{quiz.prize}</span>
              </div>
              <div className="quiz-details">
                <p>Entry Fee: {quiz.entry}</p>
                <p>Players: {quiz.players}</p>
              </div>
              <button className="btn-primary">Play Now</button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Quizzes;
