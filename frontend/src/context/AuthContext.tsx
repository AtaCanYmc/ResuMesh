import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('isLoggedIn') === 'true' ? 'session-cookie-active' : null;
  });

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/auth/verify`);
      if (res.status === 200) {
        setIsAuthenticated(true);
        setToken('session-cookie-active');
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem('isLoggedIn');
      }
    } catch (err) {
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('isLoggedIn');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = async () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/auth/logout`);
    } catch (err) {
      console.error('Logout request failed', err);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
