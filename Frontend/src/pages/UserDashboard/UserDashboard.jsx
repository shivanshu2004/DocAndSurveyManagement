import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Simple feedback data
  const availableFeedback = [
    {
      id: 1,
      title: 'General Service Feedback',
      description: 'Share your overall experience with our services'
    },
    {
      id: 2,
      title: 'Product Quality Feedback',
      description: 'Tell us about our product quality'
    },
    {
      id: 3,
      title: 'Customer Support Feedback',
      description: 'Rate your customer support experience'
    }
  ];

  const feedbackHistory = [
    { id: 1, title: 'Service Quality Feedback', submittedDate: '2024-01-15', status: 'Submitted' },
    { id: 2, title: 'Product Experience Feedback', submittedDate: '2024-01-12', status: 'Submitted' },
    { id: 3, title: 'Website Usability Feedback', submittedDate: '2024-01-10', status: 'Submitted' }
  ];

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>📊 Survey Portal</h1>
            <p>Welcome, {user?.name}!</p>
          </div>
          <div className="header-right">
            <span className="user-info">
              <span className="user-role">User</span>
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

          {/* Core Functions */}
          <div className="core-functions">
            <h2>Survey Portal</h2>
            <div className="function-cards">

              <Link to="/provide-feedback" className="function-card feedback">
                <div className="function-icon">💬</div>
                <div className="function-content">
                  <h3>Provide Feedback</h3>
                  <p>Share your thoughts and experiences with us</p>
                </div>
                <div className="function-arrow">→</div>
              </Link>

              <Link to="/survey-history" className="function-card history">
                <div className="function-icon">📋</div>
                <div className="function-content">
                  <h3>View Survey History</h3>
                  <p>Review your previously submitted surveys and feedback</p>
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

export default UserDashboard;
