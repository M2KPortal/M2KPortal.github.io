import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Hardcoded admin credentials (can be expanded to multiple users)
const VALID_USERS = [
  {
    username: 'admin',
    password: 'Mount2K2026', // Change this to your preferred password
    name: 'Administrator',
    role: 'admin'
  },
  {
    username: 'm2kadmin',
    password: '189838', // Alternative admin account
    name: 'M2K Admin',
    role: 'admin'
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        sessionStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Find matching user
    const user = VALID_USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // Don't store password in session
      const userSession = {
        username: user.username,
        name: user.name,
        role: user.role
      };
      sessionStorage.setItem('currentUser', JSON.stringify(userSession));
      setCurrentUser(userSession);
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Invalid username or password'
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
