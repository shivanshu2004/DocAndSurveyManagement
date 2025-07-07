import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../Components/Navbar';
import './SurveyHistory.css';

const SurveyHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load feedback history from localStorage
    const loadFeedbackHistory = () => {
      try {
        const storedFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
        // Filter feedback for current user
        const userFeedback = storedFeedback.filter(feedback => 
          feedback.userId === user?.id || feedback.userName === user?.name
        );
        
        // Add some mock data if no feedback exists
        if (userFeedback.length === 0) {
          const mockFeedback = [
            {
              id: 1,
              category: 'Service Quality',
              subject: 'Great customer service experience',
              message: 'The support team was very helpful and responsive.',
              rating: '5',
              submittedAt: '2024-01-15T10:30:00Z',
              status: 'Reviewed'
            },
            {
              id: 2,
              category: 'Product Features',
              subject: 'Feature request for mobile app',
              message: 'Would love to see dark mode in the mobile application.',
              rating: '4',
              submittedAt: '2024-01-10T14:20:00Z',
              status: 'In Progress'
            },
            {
              id: 3,
              category: 'Website Experience',
              subject: 'Login page improvement',
              message: 'The login process could be more streamlined.',
              rating: '3',
              submittedAt: '2024-01-05T09:15:00Z',
              status: 'Completed'
            }
          ];
          setFeedbackHistory(mockFeedback);
        } else {
          setFeedbackHistory(userFeedback);
        }
      } catch (error) {

        setFeedbackHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeedbackHistory();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Submitted': 'status-submitted',
      'In Progress': 'status-progress',
      'Reviewed': 'status-reviewed',
      'Completed': 'status-completed'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-submitted'}`}>
        {status}
      </span>
    );
  };

  const getRatingStars = (rating) => {
    const numRating = parseInt(rating);
    return '★'.repeat(numRating) + '☆'.repeat(5 - numRating);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="survey-history-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your survey history...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="survey-history-container">
        <div className="history-header">
          <button 
            className="back-btn" 
            onClick={() => navigate('/user-dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h1>📋 Survey History</h1>
          <p>Review your previously submitted surveys and feedback</p>
        </div>

        <div className="history-content">
          {feedbackHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Survey History</h3>
              <p>You haven't submitted any surveys or feedback yet.</p>
              <button 
                className="provide-feedback-btn"
                onClick={() => navigate('/provide-feedback')}
              >
                Provide Your First Feedback
              </button>
            </div>
          ) : (
            <div className="history-grid">
              {feedbackHistory.map(feedback => (
                <div key={feedback.id} className="history-card">
                  <div className="card-header">
                    <div className="card-category">{feedback.category}</div>
                    {getStatusBadge(feedback.status)}
                  </div>
                  
                  <h3 className="card-subject">{feedback.subject}</h3>
                  
                  <div className="card-rating">
                    <span className="rating-stars">{getRatingStars(feedback.rating)}</span>
                    <span className="rating-text">({feedback.rating}/5)</span>
                  </div>
                  
                  <p className="card-message">{feedback.message}</p>
                  
                  {feedback.suggestions && (
                    <div className="card-suggestions">
                      <strong>Suggestions:</strong> {feedback.suggestions}
                    </div>
                  )}
                  
                  <div className="card-footer">
                    <span className="submission-date">
                      📅 {formatDate(feedback.submittedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="history-actions">
          <button 
            className="new-feedback-btn"
            onClick={() => navigate('/provide-feedback')}
          >
            💬 Provide New Feedback
          </button>
        </div>
      </div>
    </>
  );
};

export default SurveyHistory;
