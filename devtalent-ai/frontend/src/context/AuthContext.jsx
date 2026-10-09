import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('devtalent_token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configure axios defaults
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me');
          setUser(res.data.data);
        } catch (error) {
          console.error('Error fetching user profile', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('devtalent_token', res.data.token);
    setToken(res.data.token);
    return true;
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
    localStorage.setItem('devtalent_token', res.data.token);
    setToken(res.data.token);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('devtalent_token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
