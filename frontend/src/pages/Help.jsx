import React, { useContext, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const Help = () => {
  const { balance } = useContext(WalletContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqs = [
    {
      question: 'How do I withdraw my winnings?',
      answer: 'Go to Wallet > Withdraw, enter the amount (minimum ₹100), and submit. Your withdrawal will be processed within 24-48 hours.',
    },
    {
      question: 'What is the minimum deposit amount?',
      answer: 'The minimum deposit amount is ₹10. You can add money using UPI, cards, or net banking.',
    },
    {
      question: 'How do I verify my KYC?',
      answer: 'Go to Update KYC from the menu, fill in your details, upload required documents, and submit for verification.',
    },
    {
      question: 'How does the referral program work?',
      answer: 'Share your referral code with friends. When they sign up and make their first deposit, you both earn ₹500.',
    },
    {
      question: 'Is my money safe?',
      answer: 'Yes, all transactions are encrypted and secure. We use industry-standard security measures to protect your funds.',
    },
  ];

  return (
    <div className="page-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header balance={balance} onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="page-content">
        <h2>Help & Support</h2>
        
        <div className="contact-options">
          <div className="contact-card">
            <span className="icon">📧</span>
            <p>support@khiladiadda.com</p>
          </div>
          <div className="contact-card">
            <span className="icon">📞</span>
            <p>+91 1800-123-4567</p>
          </div>
        </div>

        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div 
                className="faq-question"
                onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
              >
                <h4>{faq.question}</h4>
                <span className="arrow">{activeQuestion === index ? '▼' : '▶'}</span>
              </div>
              {activeQuestion === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Help;
