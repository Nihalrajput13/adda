import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      authService.getCurrentUser(token)
        .then(data => {
          setUser(data.user);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  // This function now correctly calls authService.login
  const login = async (phone, otp) => {
    // Pass as a single object
    const data = await authService.login({ phone, otp }); 
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };
  
  // NEW function to handle registration
  const register = async (registrationData) => {
    // registrationData = { name, email, phone, otp, referralCode }
    const data = await authService.register(registrationData);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    // Expose the new 'register' function to your components
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};