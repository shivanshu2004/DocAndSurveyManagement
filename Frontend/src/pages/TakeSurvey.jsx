import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSurvey } from "../contexts/SurveyContext";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../Components/Navbar";
import "./TakeSurvey.css";

const TakeSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { surveys, loading } = useSurvey();
  const { user } = useAuth();

  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState('list'); // 'list', 'taking', 'completed'
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Get available surveys (active surveys only)
  const availableSurveys = surveys.filter(survey => survey.status === 'active');

  useEffect(() => {
    if (id) {
      const survey = surveys.find(s => s.id === id);
      if (survey && survey.status === 'active') {
        setSelectedSurvey(survey);
        setCurrentStep('taking');
        // Initialize responses object
        const initialResponses = {};
        survey.questions.forEach(q => {
          initialResponses[q.id] = '';
        });
        setResponses(initialResponses);
      } else {
        navigate('/take-survey');
      }
    }
  }, [id, surveys, navigate]);

  const handleSurveySelect = (survey) => {
    setSelectedSurvey(survey);
    setCurrentStep('taking');
    // Initialize responses
    const initialResponses = {};
    survey.questions.forEach(q => {
      initialResponses[q.id] = '';
    });
    setResponses(initialResponses);
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Clear error for this question
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ''
      }));
    }
  };

  const validateResponses = () => {
    const newErrors = {};
    selectedSurvey.questions.forEach(question => {
      if (question.required && (!responses[question.id] || responses[question.id].trim() === '')) {
        newErrors[question.id] = 'This question is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateResponses()) {
      return;
    }

    setSubmitting(true);

    try {
      // Simulate API call to submit survey response
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would typically send the response to your backend
      const surveyResponse = {
        surveyId: selectedSurvey.id,
        userId: user?.id || 'anonymous',
        responses: responses,
        submittedAt: new Date().toISOString(),
        userInfo: {
          name: user?.name || 'Anonymous User',
          email: user?.email || ''
        }
      };



      // Save to localStorage for demo purposes
      const existingResponses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
      existingResponses.push(surveyResponse);
      localStorage.setItem('surveyResponses', JSON.stringify(existingResponses));

      setCurrentStep('completed');
    } catch (error) {

      alert('Error submitting survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToList = () => {
    setSelectedSurvey(null);
    setCurrentStep('list');
    setResponses({});
    setErrors({});
    navigate('/take-survey');
  };

  const renderQuestionInput = (question) => {
    const value = responses[question.id] || '';
    const hasError = errors[question.id];

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="question-input">
            <select
              value={value}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              className={hasError ? 'error' : ''}
              required={question.required}
            >
              <option value="">Select an option</option>
              {question.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {hasError && <span className="error-text">{hasError}</span>}
          </div>
        );

      case 'text':
        return (
          <div className="question-input">
            <textarea
              value={value}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder="Enter your response..."
              className={hasError ? 'error' : ''}
              required={question.required}
              rows="3"
            />
            {hasError && <span className="error-text">{hasError}</span>}
          </div>
        );

      case 'rating':
        return (
          <div className="question-input">
            <div className="rating-options">
              {[1, 2, 3, 4, 5].map(rating => (
                <label key={rating} className="rating-option">
                  <input
                    type="radio"
                    name={question.id}
                    value={rating}
                    checked={value === rating.toString()}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    required={question.required}
                  />
                  <span className="rating-label">{rating}</span>
                </label>
              ))}
            </div>
            {hasError && <span className="error-text">{hasError}</span>}
          </div>
        );

      default:
        return (
          <div className="question-input">
            <input
              type="text"
              value={value}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder="Enter your response..."
              className={hasError ? 'error' : ''}
              required={question.required}
            />
            {hasError && <span className="error-text">{hasError}</span>}
          </div>
        );
    }
  };

  // Render survey list
  const renderSurveyList = () => (
    <div className="surveys-list">
      <div className="surveys-header">
        <h2 className="take-survey-title">📝 Available Surveys</h2>
        <p className="surveys-subtitle">Choose a survey to provide your feedback</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading surveys...</p>
        </div>
      ) : availableSurveys.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Surveys Available</h3>
          <p>There are currently no active surveys to take. Please check back later.</p>
        </div>
      ) : (
        <div className="surveys-grid">
          {availableSurveys.map(survey => (
            <div key={survey.id} className="survey-card-item">
              <div className="survey-card-header">
                <h3>{survey.title}</h3>
                <span className="survey-status active">Active</span>
              </div>
              <p className="survey-description">{survey.description}</p>
              <div className="survey-meta">
                <span className="question-count">
                  📝 {survey.questions?.length || 0} questions
                </span>
                <span className="survey-date">
                  📅 Created: {survey.createdAt}
                </span>
              </div>
              <button
                className="take-survey-btn"
                onClick={() => handleSurveySelect(survey)}
              >
                Take Survey
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render survey taking form
  const renderSurveyForm = () => (
    <div className="survey-taking">
      <div className="survey-header">
        <button className="back-btn" onClick={handleBackToList}>
          ← Back to Surveys
        </button>
        <h2 className="survey-title">{selectedSurvey.title}</h2>
        <p className="survey-description">{selectedSurvey.description}</p>
      </div>

      <form className="survey-form" onSubmit={handleSubmit}>
        <div className="questions-container">
          {selectedSurvey.questions.map((question, index) => (
            <div key={question.id} className="question-block">
              <div className="question-header">
                <span className="question-number">Q{index + 1}</span>
                <label className="question-text">
                  {question.question}
                  {question.required && <span className="required">*</span>}
                </label>
              </div>
              {renderQuestionInput(question)}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={handleBackToList}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </div>
      </form>
    </div>
  );

  // Render completion message
  const renderCompletion = () => (
    <div className="completion-state">
      <div className="completion-icon">✅</div>
      <h2>Thank You!</h2>
      <p>Your feedback has been submitted successfully.</p>
      <div className="completion-actions">
        <button className="primary-btn" onClick={handleBackToList}>
          Take Another Survey
        </button>
        <button
          className="secondary-btn"
          onClick={() => navigate('/user-dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="take-survey-container">
        {currentStep === 'list' && renderSurveyList()}
        {currentStep === 'taking' && selectedSurvey && renderSurveyForm()}
        {currentStep === 'completed' && renderCompletion()}
      </div>
    </>
  );
};

export default TakeSurvey;
