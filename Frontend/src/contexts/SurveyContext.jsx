import React, { createContext, useContext, useState, useEffect } from 'react';

const SurveyContext = createContext();

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};

export const SurveyProvider = ({ children }) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load surveys from localStorage on component mount
  useEffect(() => {
    const savedSurveys = localStorage.getItem('surveys');
    if (savedSurveys) {
      try {
        setSurveys(JSON.parse(savedSurveys));
      } catch (error) {

        // Initialize with sample surveys if parsing fails
        initializeSampleSurveys();
      }
    } else {
      // Initialize with sample surveys if none exist
      initializeSampleSurveys();
    }
  }, []);

  // Save surveys to localStorage whenever surveys change
  useEffect(() => {
    localStorage.setItem('surveys', JSON.stringify(surveys));
  }, [surveys]);

  const initializeSampleSurveys = () => {
    const sampleSurveys = [
      {
        id: '1',
        title: 'Customer Satisfaction Survey',
        description: 'Help us improve our services by sharing your experience',
        status: 'active',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        responses: 89,
        questions: [
          {
            id: 'q1',
            type: 'rating',
            question: 'How satisfied are you with our service?',
            required: true,
            options: ['1', '2', '3', '4', '5']
          },
          {
            id: 'q2',
            type: 'text',
            question: 'What can we improve?',
            required: false
          }
        ]
      },
      {
        id: '2',
        title: 'Product Feature Feedback',
        description: 'Share your thoughts on our latest product features',
        status: 'draft',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12',
        responses: 0,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Which feature do you find most useful?',
            required: true,
            options: ['Dashboard', 'Reports', 'Analytics', 'Settings']
          }
        ]
      }
    ];
    setSurveys(sampleSurveys);
  };

  // Create a new survey
  const createSurvey = async (surveyData) => {
    setLoading(true);
    try {
      const newSurvey = {
        id: Date.now().toString(),
        ...surveyData,
        status: surveyData.status || 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        responses: 0
      };
      
      setSurveys(prev => [...prev, newSurvey]);
      setLoading(false);
      return { success: true, survey: newSurvey };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Failed to create survey' };
    }
  };

  // Get survey by ID
  const getSurvey = (id) => {
    return surveys.find(survey => survey.id === id);
  };

  // Update an existing survey
  const updateSurvey = async (id, updatedData) => {
    setLoading(true);
    try {
      setSurveys(prev => prev.map(survey => 
        survey.id === id 
          ? { 
              ...survey, 
              ...updatedData, 
              updatedAt: new Date().toISOString().split('T')[0] 
            }
          : survey
      ));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Failed to update survey' };
    }
  };

  // Delete a survey
  const deleteSurvey = async (id) => {
    setLoading(true);
    try {
      setSurveys(prev => prev.filter(survey => survey.id !== id));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Failed to delete survey' };
    }
  };

  // Duplicate a survey
  const duplicateSurvey = async (id) => {
    setLoading(true);
    try {
      const originalSurvey = surveys.find(survey => survey.id === id);
      if (!originalSurvey) {
        throw new Error('Survey not found');
      }

      const duplicatedSurvey = {
        ...originalSurvey,
        id: Date.now().toString(),
        title: `${originalSurvey.title} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        responses: 0
      };

      setSurveys(prev => [...prev, duplicatedSurvey]);
      setLoading(false);
      return { success: true, survey: duplicatedSurvey };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Failed to duplicate survey' };
    }
  };

  // Get survey statistics
  const getSurveyStats = () => {
    const total = surveys.length;
    const active = surveys.filter(s => s.status === 'active').length;
    const draft = surveys.filter(s => s.status === 'draft').length;
    const completed = surveys.filter(s => s.status === 'completed').length;
    const totalResponses = surveys.reduce((sum, s) => sum + (s.responses || 0), 0);

    return {
      total,
      active,
      draft,
      completed,
      totalResponses
    };
  };

  const value = {
    surveys,
    loading,
    createSurvey,
    getSurvey,
    updateSurvey,
    deleteSurvey,
    duplicateSurvey,
    getSurveyStats
  };

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
};

export default SurveyContext;
