import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Set default baseURL for API calls
axios.defaults.baseURL = 'http://localhost:5001';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      // Set axios default headers for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      localStorage.removeItem('user');
      // Remove axios default headers when user logs out
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      console.error('Login error:', err.response?.data || err.message);
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    console.log('Registering with:', { username, email, password: '****' });
    try {
      const res = await axios.post('/api/auth/register', { 
        username, 
        email, 
        password 
      });
      console.log('Registration successful:', res.data);
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Registration error:', err);
      const errorResponse = err.response?.data;
      console.log('Error response:', errorResponse);
      const errorMessage = errorResponse?.message || 'Registration failed';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Admin can create users with a specified role
  const adminCreateUser = async (username, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure we send the authorization token in the request
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      console.log('Creating admin user with token:', user.token);
      
      const res = await axios.post('/api/auth/register', {
        username,
        email,
        password,
        role
      }, config);
      
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Admin user creation error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'User creation failed';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      error, 
      clearError, 
      adminCreateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
