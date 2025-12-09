import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext();

// Inactivity timeout duration in milliseconds (15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_TIME = 2 * 60 * 1000; // 2 minutes before logout

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const inactivityTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('azbs_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('azbs_user');
    setShowInactivityWarning(false);
    
    // Clear timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    // Clear existing timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    
    // Hide warning if it was showing
    setShowInactivityWarning(false);

    // Only set timers if user is logged in
    if (user) {
      // Set warning timer (shows warning 2 minutes before logout)
      warningTimerRef.current = setTimeout(() => {
        setShowInactivityWarning(true);
      }, INACTIVITY_TIMEOUT - WARNING_TIME);

      // Set logout timer
      inactivityTimerRef.current = setTimeout(() => {
        console.log('User logged out due to inactivity');
        logout();
      }, INACTIVITY_TIMEOUT);
    }
  }, [user, logout]);

  // Track user activity
  useEffect(() => {
    if (!user) return;

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Reset timer on any user activity
    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Initialize the timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
    };
  }, [user, resetInactivityTimer]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('azbs_user', JSON.stringify(userData));
  };

  const dismissWarning = () => {
    setShowInactivityWarning(false);
    resetInactivityTimer();
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    showInactivityWarning,
    dismissWarning,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
