import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const InactivityWarning = () => {
  const { showInactivityWarning, dismissWarning } = useAuth();
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    if (showInactivityWarning) {
      setCountdown(120); // Reset to 2 minutes
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showInactivityWarning]);

  if (!showInactivityWarning) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="inactivity-warning-overlay">
      <div className="inactivity-warning-modal">
        <div className="inactivity-warning-icon">⏰</div>
        <h2>Still there?</h2>
        <p>You've been inactive for a while. You'll be automatically logged out in:</p>
        <div className="inactivity-countdown">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
        <p className="inactivity-subtext">Click the button below to stay logged in.</p>
        <button onClick={dismissWarning} className="btn btn-primary btn-large">
          Yes, I'm Still Here!
        </button>
      </div>
    </div>
  );
};

export default InactivityWarning;

