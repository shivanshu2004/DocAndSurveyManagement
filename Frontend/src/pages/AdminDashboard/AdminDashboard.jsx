import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();


  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🔧 Admin Dashboard</h1>
            <p>Welcome back, {user?.name}!</p>
          </div>
          <div className="header-right">
            <span className="user-info">
              <span className="user-role">Admin</span>
              <span className="user-name">{user?.name}</span>
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">


          {/* Core Functionalities */}
          <div className="core-functions">
            <h2>Survey Management</h2>
            <div className="function-cards">
              <Link to="/create-survey" className="function-card create">
                <div className="function-icon">📝</div>
                <div className="function-content">
                  <h3>Create Survey</h3>
                  <p>Design and create new surveys with multiple question types</p>
                </div>
                <div className="function-arrow">→</div>
              </Link>

              <Link to="/survey-list" className="function-card update">
                <div className="function-icon">✏️</div>
                <div className="function-content">
                  <h3>Update Survey</h3>
                  <p>Edit existing surveys, modify questions and settings</p>
                </div>
                <div className="function-arrow">→</div>
              </Link>

              <Link to="/survey-list" className="function-card delete">
                <div className="function-icon">🗑️</div>
                <div className="function-content">
                  <h3>Delete Survey</h3>
                  <p>Remove surveys that are no longer needed</p>
                </div>
                <div className="function-arrow">→</div>
              </Link>

              <Link to="/survey-list" className="function-card view">
                <div className="function-icon">👁️</div>
                <div className="function-content">
                  <h3>View Survey</h3>
                  <p>Browse and preview all created surveys</p>
                </div>
                <div className="function-arrow">→</div>
              </Link>

            </div>
          </div>


        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
