import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setSidebarOpen(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <button 
            className="hamburger-menu" 
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <Link to="/home" className="navbar-logo">
            AZBS
          </Link>
          {isAuthenticated && (
            <Link to="/profile" className="navbar-profile-icon">
              <span className="profile-icon">👤</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/home" className="sidebar-logo" onClick={closeSidebar}>
            👶💗 AZBS
          </Link>
          <button 
            className="sidebar-close" 
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="sidebar-content">
          {isAuthenticated ? (
            <>
              <div className="sidebar-user-info">
                <div className="sidebar-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
                </div>
                <div className="sidebar-user-details">
                  <span className="sidebar-user-name">{user?.name || 'Guest'}</span>
                  <span className="sidebar-user-email">{user?.email}</span>
                </div>
              </div>

              <nav className="sidebar-nav">
                <Link to="/home" className="sidebar-link" onClick={closeSidebar}>
                  <span className="sidebar-icon">🏠</span>
                  <span>Home</span>
                </Link>
                <Link to="/rsvp" className="sidebar-link" onClick={closeSidebar}>
                  <span className="sidebar-icon">✉️</span>
                  <span>RSVP</span>
                </Link>
                <Link to="/items" className="sidebar-link" onClick={closeSidebar}>
                  <span className="sidebar-icon">🎁</span>
                  <span>Browse Items</span>
                </Link>
                <Link to="/claimed" className="sidebar-link" onClick={closeSidebar}>
                  <span className="sidebar-icon">📦</span>
                  <span>Your Claims</span>
                </Link>
                <Link to="/event" className="sidebar-link" onClick={closeSidebar}>
                  <span className="sidebar-icon">🗺️</span>
                  <span>Event Details</span>
                </Link>
                <Link to="/banking" className="sidebar-link" onClick={closeSidebar}>
                  <span className="sidebar-icon">💳</span>
                  <span>Banking Details</span>
                </Link>
                <Link to="/how-to-use" className="sidebar-link" onClick={closeSidebar}>
                  <span className="sidebar-icon">📖</span>
                  <span>How to Use</span>
                </Link>
              </nav>

              <div className="sidebar-footer">
                <button onClick={handleLogout} className="sidebar-logout-btn">
                  <span className="sidebar-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <nav className="sidebar-nav">
              <Link to="/login" className="sidebar-link" onClick={closeSidebar}>
                <span className="sidebar-icon">🔑</span>
                <span>Login</span>
              </Link>
              <Link to="/register" className="sidebar-link" onClick={closeSidebar}>
                <span className="sidebar-icon">📝</span>
                <span>Register</span>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
