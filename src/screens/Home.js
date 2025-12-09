import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const getFirstName = () => {
    if (user?.name) {
      return user.name.split(' ')[0];
    }
    return 'Guest';
  };

  return (
    <div className="screen-container">
      <div className="home-hero">
        <div className="home-hero-content">
          <span className="home-icon">👶💗</span>
          <h1 className="home-title">Angelique and Zaadrick's Baby Shower</h1>
          <p className="home-subtitle">Join us in celebrating our little princess!</p>
          <div className="home-greeting">
            <p>Welcome back, <strong>{getFirstName()}</strong>! 👋</p>
          </div>
        </div>
      </div>

      <div className="home-event-info">
        <div className="home-info-card">
          <span className="info-card-icon">📅</span>
          <h3>When</h3>
          <p>10 January 2026</p>
        </div>
        <div className="home-info-card">
          <span className="info-card-icon">📍</span>
          <h3>Where</h3>
          <p>The Hamlet Country Lodge</p>
        </div>
      </div>

      <div className="home-quick-actions">
        <h2>Quick Actions</h2>
        <div className="home-actions-grid">
          <Link to="/rsvp" className="home-action-card">
            <div className="action-card-icon">✉️</div>
            <h3>RSVP</h3>
            <p>Let us know if you're coming</p>
          </Link>

          <Link to="/items" className="home-action-card">
            <div className="action-card-icon">🎁</div>
            <h3>Browse Items</h3>
            <p>See what we need for baby</p>
          </Link>

          <Link to="/claimed" className="home-action-card">
            <div className="action-card-icon">📦</div>
            <h3>Your Claims</h3>
            <p>View items you've claimed</p>
          </Link>

          <Link to="/event" className="home-action-card">
            <div className="action-card-icon">🗺️</div>
            <h3>Event Details</h3>
            <p>Get directions and info</p>
          </Link>

          <Link to="/banking" className="home-action-card">
            <div className="action-card-icon">💳</div>
            <h3>Banking Details</h3>
            <p>View payment information</p>
          </Link>

          <Link to="/profile" className="home-action-card">
            <div className="action-card-icon">👤</div>
            <h3>Your Profile</h3>
            <p>Manage your account</p>
          </Link>

          <Link to="/how-to-use" className="home-action-card">
            <div className="action-card-icon">📖</div>
            <h3>How to Use</h3>
            <p>Learn how to use the app</p>
          </Link>
        </div>
      </div>

      <div className="home-footer-note">
        <div className="footer-note-content">
          <span className="footer-note-icon">💝👶💗</span>
          <p>Thank you for being part of our special celebration!</p>
          <p className="footer-note-subtitle">We can't wait to see you there</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

