import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { loginUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data);
        } catch (err) {
          console.error("Token verification failed", err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.access_token);
      const userResponse = await api.get('/api/auth/me');
      setUser(userResponse.data);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      setError(err.response?.data?.detail || "Invalid email or password");
      setLoading(false);
      return false;
    }
  };

  const register = async (email, password, fullName) => {
    setError(null);
    setLoading(true);
    try {
      await api.post('/api/auth/register', {
        email,
        password,
        full_name: fullName,
      });
      // Automatically login after registration
      const success = await login(email, password);
      return success;
    } catch (err) {
      console.error("Registration failed", err);
      setError(err.response?.data?.detail || "Registration failed. Please check credentials.");
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export default AuthContext;
