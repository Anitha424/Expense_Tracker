import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const setAuthSession = (authToken, authUser) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Logging in with:', { email });
      const response = await api.post('/auth/login', { email, password });
      const { token: authToken, user: loggedInUser } = response.data;
      console.log('✅ Login successful');
      setAuthSession(authToken, loggedInUser);
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('📝 Registering with:', { name, email });
      const response = await api.post('/auth/register', { name, email, password });
      const { token: authToken, user: registeredUser } = response.data;
      console.log('✅ Registration successful');
      setAuthSession(authToken, registeredUser);
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, register, logout, setAuthSession }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
