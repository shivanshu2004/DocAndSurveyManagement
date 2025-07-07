import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAdmin, isUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <Link to={isAdmin() ? "/admin-dashboard" : "/user-dashboard"} className="brand-link">
            📊 Survey Portal
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          <div className="navbar-nav">
            {isAdmin() && (
              <>
                <Link
                  to="/admin-dashboard"
                  className={`nav-link ${isActive('/admin-dashboard') ? 'active' : ''}`}
                >
                  🏠 Dashboard
                </Link>
                <Link
                  to="/create-survey"
                  className={`nav-link ${isActive('/create-survey') ? 'active' : ''}`}
                >
                  📝 Create Survey
                </Link>
                <Link
                  to="/results"
                  className={`nav-link ${isActive('/results') ? 'active' : ''}`}
                >
                  📊 View Results
                </Link>
                <Link
                  to="/admin"
                  className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                >
                  ⚙️ Admin Panel
                </Link>
              </>
            )}

            {isUser() && (
              <>
                <Link
                  to="/user-dashboard"
                  className={`nav-link ${isActive('/user-dashboard') ? 'active' : ''}`}
                >
                  🏠 Dashboard
                </Link>
                <Link
                  to="/take-survey"
                  className={`nav-link ${isActive('/take-survey') ? 'active' : ''}`}
                >
                  🗳️ Take Survey
                </Link>
              </>
            )}
          </div>

          {/* User Info and Logout */}
          <div className="navbar-user">
            <div className="user-info">
              <span className="user-role">{user?.role}</span>
              <span className="user-name">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav">
          {isAdmin() && (
            <>
              <Link
                to="/admin-dashboard"
                className={`mobile-nav-link ${isActive('/admin-dashboard') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 Dashboard
              </Link>
              <Link
                to="/create-survey"
                className={`mobile-nav-link ${isActive('/create-survey') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📝 Create Survey
              </Link>
              <Link
                to="/results"
                className={`mobile-nav-link ${isActive('/results') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📊 View Results
              </Link>
              <Link
                to="/admin"
                className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ⚙️ Admin Panel
              </Link>
            </>
          )}

          {isUser() && (
            <>
              <Link
                to="/user-dashboard"
                className={`mobile-nav-link ${isActive('/user-dashboard') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 Dashboard
              </Link>
              <Link
                to="/take-survey"
                className={`mobile-nav-link ${isActive('/take-survey') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🗳️ Take Survey
              </Link>
            </>
          )}
        </div>

        <div className="mobile-user-section">
          <div className="mobile-user-info">
            <span className="mobile-user-role">{user?.role}</span>
            <span className="mobile-user-name">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="mobile-logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
