import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          AZBS
        </Link>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/home" className="navbar-link">
                Home
              </Link>
              <Link to="/rsvp" className="navbar-link">
                RSVP
              </Link>
              <Link to="/items" className="navbar-link">
                Items
              </Link>
              <Link to="/claimed" className="navbar-link">
                Claimed Items
              </Link>
              <Link to="/event" className="navbar-link">
                Event Details
              </Link>
              <Link to="/banking" className="navbar-link">
                Banking Details
              </Link>
              <Link to="/how-to-use" className="navbar-link">
                Help
              </Link>
              <div className="navbar-user">
                <Link to="/profile" className="navbar-link navbar-user-name">
                  {user?.name || user?.email}
                </Link>
                <button onClick={handleLogout} className="btn btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
