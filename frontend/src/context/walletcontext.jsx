import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
      fetchTransactions();
    }
  }, [isAuthenticated]);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/wallet/balance');
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/wallet/transactions');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const addMoney = async (amount) => {
    try {
      const response = await api.post('/wallet/add', { amount });
      setBalance(response.data.balance);
      fetchTransactions();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const withdraw = async (amount) => {
    try {
      const response = await api.post('/wallet/withdraw', { amount });
      setBalance(response.data.balance);
      fetchTransactions();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, addMoney, withdraw, fetchBalance }}>
      {children}
    </WalletContext.Provider>
  );
};