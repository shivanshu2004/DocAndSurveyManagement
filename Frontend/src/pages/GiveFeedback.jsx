import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../Components/Navbar';
import './GiveFeedback.css';

const GiveFeedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [feedback, setFeedback] = useState({
    rating: '',
    category: '',
    subject: '',
    message: '',
    suggestions: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Mock feedback categories based on ID
  const feedbackTypes = {
    '1': {
      title: 'General Service Feedback',
      description: 'Share your overall experience with our services',
      categories: ['Service Quality', 'Staff Behavior', 'Response Time', 'Overall Experience']
    },
    '2': {
      title: 'Product Quality Feedback',
      description: 'Tell us about our product quality',
      categories: ['Product Features', 'Product Quality', 'Usability', 'Value for Money']
    },
    '3': {
      title: 'Customer Support Feedback',
      description: 'Rate your customer support experience',
      categories: ['Support Response', 'Problem Resolution', 'Staff Helpfulness', 'Communication']
    }
  };

  const currentFeedback = feedbackTypes[id] || feedbackTypes['1'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!feedback.rating) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!feedback.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!feedback.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!feedback.message.trim()) {
      newErrors.message = 'Feedback message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create feedback object
      const feedbackData = {
        id: Date.now(),
        type: currentFeedback.title,
        ...feedback,
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Anonymous User',
        submittedAt: new Date().toISOString(),
        status: 'Submitted'
      };
      
      // Save to localStorage for demo
      const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
      existingFeedback.push(feedbackData);
      localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));
      

      
      // Show success and redirect
      alert('Thank you for your feedback! Your feedback has been submitted successfully.');
      navigate('/user-dashboard');
      
    } catch (error) {

      alert('Error submitting feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="give-feedback-container">
        <div className="feedback-form-card">
          <div className="feedback-header">
            <button 
              className="back-btn" 
              onClick={() => navigate('/user-dashboard')}
            >
              ← Back to Dashboard
            </button>
            <h1>{currentFeedback.title}</h1>
            <p>{currentFeedback.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="feedback-form">
            {/* Rating */}
            <div className="form-group">
              <label htmlFor="rating">Overall Rating *</label>
              <div className="rating-options">
                {[1, 2, 3, 4, 5].map(rating => (
                  <label key={rating} className="rating-option">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={feedback.rating === rating.toString()}
                      onChange={handleInputChange}
                    />
                    <span className="rating-star">{'★'.repeat(rating)}</span>
                    <span className="rating-text">
                      {rating === 1 ? 'Poor' : 
                       rating === 2 ? 'Fair' : 
                       rating === 3 ? 'Good' : 
                       rating === 4 ? 'Very Good' : 'Excellent'}
                    </span>
                  </label>
                ))}
              </div>
              {errors.rating && <span className="error-text">{errors.rating}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Feedback Category *</label>
              <select
                name="category"
                value={feedback.category}
                onChange={handleInputChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select a category</option>
                {currentFeedback.categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            {/* Subject */}
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                name="subject"
                value={feedback.subject}
                onChange={handleInputChange}
                placeholder="Brief subject of your feedback"
                className={errors.subject ? 'error' : ''}
              />
              {errors.subject && <span className="error-text">{errors.subject}</span>}
            </div>

            {/* Message */}
            <div className="form-group">
              <label htmlFor="message">Your Feedback *</label>
              <textarea
                name="message"
                value={feedback.message}
                onChange={handleInputChange}
                placeholder="Please share your detailed feedback..."
                rows="5"
                className={errors.message ? 'error' : ''}
              />
              {errors.message && <span className="error-text">{errors.message}</span>}
            </div>

            {/* Suggestions */}
            <div className="form-group">
              <label htmlFor="suggestions">Suggestions for Improvement (Optional)</label>
              <textarea
                name="suggestions"
                value={feedback.suggestions}
                onChange={handleInputChange}
                placeholder="Any suggestions to help us improve..."
                rows="3"
              />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/user-dashboard')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default GiveFeedback;
