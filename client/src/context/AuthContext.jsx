import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved credentials on app launch
    const storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
      try {
        const parsed = JSON.parse(storedInfo);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (e) {
        console.error('Failed to parse local stored user', e);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem(
        'userInfo',
        JSON.stringify({ user: res.data.user, token: res.data.token })
      );
      return res.data;
    }
  };

  // Register handler
  const register = async (name, email, password, role = 'student') => {
    const res = await api.post('/auth/register', { name, email, password, role });
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem(
        'userInfo',
        JSON.stringify({ user: res.data.user, token: res.data.token })
      );
      return res.data;
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
