// src/components/common/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "../../styles/components/header.css";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <i className="fas fa-recycle"></i>
          <span>SwatchhCity</span>
        </Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          {currentUser ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/report" onClick={() => setIsMenuOpen(false)}>Report Issue</Link>
              <Link to="/complaints" onClick={() => setIsMenuOpen(false)}>My Complaints</Link>
              <Link to="/recyle-waste" onClick={() => setIsMenuOpen(false)}>Recyle Waste's</Link>

              <Link to="/rewards" onClick={() => setIsMenuOpen(false)}>Rewards</Link>
              <div className="user-menu">
                <span className="welcome-text">Hello, {currentUser.name}</span>
                <div className="points-badge">
                  <i className="fas fa-star"></i>
                  {currentUser.points} pts
                </div>
                <Link to="/profile" className="profile-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-user-circle"></i>
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="signup-btn" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;