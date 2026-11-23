import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState([]);

  const fetchDemoUsers = async () => {
    try {
      const list = await api.getDemoUsers();
      setDemoUsers(list);
    } catch (e) {
      console.error('Failed to load demo users', e);
    }
  };

  const loadCurrentUser = async () => {
    const token = getAuthToken();
    if (!token) {
      try {
        const list = await api.getDemoUsers();
        setDemoUsers(list);
      } catch (err) {
        console.error('Failed to load demo users', err);
      } finally {
        setUser(null);
        setLoading(false);
      }
      return;
    }

    try {
      const me = await api.getMe();
      setUser(me);
    } catch (err) {
      console.error('Session expired', err);
      setAuthToken('');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoUsers();
    loadCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    setAuthToken(res.access_token);
    const me = await api.getMe();
    setUser(me);
    return me;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    setAuthToken(res.access_token);
    const me = await api.getMe();
    setUser(me);
    return me;
  };

  const logout = () => {
    setAuthToken('');
    setUser(null);
  };

  const switchDemoUser = async (userId) => {
    setLoading(true);
    try {
      const res = await api.demoLogin(userId);
      setAuthToken(res.access_token);
      const me = await api.getMe();
      setUser(me);
    } catch (err) {
      console.error('Switch user failed', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
    } catch (err) {
      console.error('Refresh user failed', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoUsers,
        login,
        register,
        logout,
        switchDemoUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
