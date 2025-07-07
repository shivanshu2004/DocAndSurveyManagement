import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Survey Portal</h1>
        <p>Choose your access type</p>
      </div>

      <div className="login-grids">
        {/* User Grid */}
        <div className="login-grid user-grid">
          <div className="grid-header">
            <div className="grid-icon">👤</div>
            <h2>User Access</h2>
            <p>Take surveys and participate</p>
          </div>

          <div className="grid-buttons">
            <Link to="/user-login" className="grid-btn login-btn">
              <span className="btn-icon">🔑</span>
              <span className="btn-text">User Login</span>
            </Link>

            <Link to="/register?type=user" className="grid-btn signup-btn">
              <span className="btn-icon">📝</span>
              <span className="btn-text">User Signup</span>
            </Link>
          </div>
        </div>

        {/* Admin Grid */}
        <div className="login-grid admin-grid">
          <div className="grid-header">
            <div className="grid-icon">🔧</div>
            <h2>Admin Access</h2>
            <p>Manage surveys and analytics</p>
          </div>

          <div className="grid-buttons">
            <Link to="/admin-login" className="grid-btn login-btn">
              <span className="btn-icon">🔑</span>
              <span className="btn-text">Admin Login</span>
            </Link>

            <Link to="/register?type=admin" className="grid-btn signup-btn">
              <span className="btn-icon">📝</span>
              <span className="btn-text">Admin Signup</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
