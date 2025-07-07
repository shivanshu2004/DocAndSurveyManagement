import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import Navbar from "../../Components/Navbar";
import "./EditSurvey.css";

const EditSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSurvey, updateSurvey, loading } = useSurvey();
  
  const [surveyData, setSurveyData] = useState({
    title: "",
    description: "",
    status: "draft",
    questions: [],
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const questionTypes = [
    { value: "text", label: "📝 Text Answer", description: "Open-ended text response" },
    { value: "multiple-choice", label: "☑️ Multiple Choice", description: "Select one option" },
    { value: "checkbox", label: "✅ Checkboxes", description: "Select multiple options" },
    { value: "rating", label: "⭐ Rating Scale", description: "1-5 star rating" },
    { value: "yes-no", label: "✔️ Yes/No", description: "Simple yes or no question" },
    { value: "email", label: "📧 Email", description: "Email address input" },
    { value: "number", label: "🔢 Number", description: "Numeric input" }
  ];

  useEffect(() => {
    const survey = getSurvey(id);
    if (survey) {
      setSurveyData(survey);
      setIsLoading(false);
    } else {
      navigate('/survey-list');
    }
  }, [id, getSurvey, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!surveyData.title.trim()) {
      newErrors.title = "Survey title is required";
    }
    
    if (!surveyData.description.trim()) {
      newErrors.description = "Survey description is required";
    }
    
    surveyData.questions.forEach((q, index) => {
      if (!q.question.trim()) {
        newErrors[`question_${index}`] = "Question text is required";
      }
      
      if ((q.type === 'multiple-choice' || q.type === 'checkbox') && q.options.length < 2) {
        newErrors[`options_${index}`] = "At least 2 options are required";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSurveyData({ ...surveyData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...surveyData.questions];
    updatedQuestions[index][field] = value;
    
    if (field === 'type') {
      if (value === 'multiple-choice' || value === 'checkbox') {
        updatedQuestions[index].options = ['Option 1', 'Option 2'];
      } else if (value === 'rating') {
        updatedQuestions[index].options = ['1', '2', '3', '4', '5'];
      } else if (value === 'yes-no') {
        updatedQuestions[index].options = ['Yes', 'No'];
      } else {
        updatedQuestions[index].options = [];
      }
    }
    
    setSurveyData({ ...surveyData, questions: updatedQuestions });
    
    if (errors[`question_${index}`] || errors[`options_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`question_${index}`];
      delete newErrors[`options_${index}`];
      setErrors(newErrors);
    }
  };

  const addQuestion = () => {
    setSurveyData({
      ...surveyData,
      questions: [...surveyData.questions, { 
        id: Date.now().toString(),
        question: "", 
        type: "text",
        required: false,
        options: []
      }],
    });
  };

  const removeQuestion = (index) => {
    if (surveyData.questions.length > 1) {
      const updatedQuestions = surveyData.questions.filter((_, i) => i !== index);
      setSurveyData({ ...surveyData, questions: updatedQuestions });
    }
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...surveyData.questions];
    const optionNumber = updatedQuestions[questionIndex].options.length + 1;
    updatedQuestions[questionIndex].options.push(`Option ${optionNumber}`);
    setSurveyData({ ...surveyData, questions: updatedQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...surveyData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setSurveyData({ ...surveyData, questions: updatedQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...surveyData.questions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setSurveyData({ ...surveyData, questions: updatedQuestions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const result = await updateSurvey(id, surveyData);
    
    if (result.success) {
      setSuccess("Survey updated successfully!");
      setTimeout(() => {
        navigate('/survey-list');
      }, 2000);
    } else {
      setErrors({ submit: result.error });
    }
  };

  const saveDraft = async () => {
    const draftData = { ...surveyData, status: 'draft' };
    const result = await updateSurvey(id, draftData);
    
    if (result.success) {
      setSuccess("Survey saved as draft!");
      setTimeout(() => {
        navigate('/survey-list');
      }, 2000);
    }
  };

  const publishSurvey = async () => {
    if (!validateForm()) {
      return;
    }
    
    const publishData = { ...surveyData, status: 'active' };
    const result = await updateSurvey(id, publishData);
    
    if (result.success) {
      setSuccess("Survey published successfully!");
      setTimeout(() => {
        navigate('/survey-list');
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <p>Loading survey...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="edit-survey-hero">
        <div className="survey-header">
          <div className="header-nav">
            <Link to="/survey-list" className="back-link">← Back to Surveys</Link>
          </div>
          <h2 className="survey-title">✏️ Edit Survey</h2>
          <p className="survey-subtitle">Update your survey content and settings</p>
        </div>

        {success && (
          <div className="success-message">
            ✅ {success}
          </div>
        )}

        {errors.submit && (
          <div className="error-message">
            ❌ {errors.submit}
          </div>
        )}

        <form className="survey-form-glass" onSubmit={handleSubmit}>
          {/* Survey Basic Info */}
          <div className="survey-basic-info">
            <div className="form-group">
              <label htmlFor="title">Survey Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={surveyData.title}
                onChange={handleInputChange}
                placeholder="Enter survey title"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Survey Description *</label>
              <textarea
                id="description"
                name="description"
                value={surveyData.description}
                onChange={handleInputChange}
                placeholder="Describe what this survey is about"
                rows="3"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Survey Status</label>
              <select
                id="status"
                name="status"
                value={surveyData.status}
                onChange={handleInputChange}
              >
                <option value="draft">📝 Draft</option>
                <option value="active">🟢 Active</option>
                <option value="paused">⏸️ Paused</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
          </div>

          {/* Questions Section - Same as CreateSurvey */}
          <div className="questions-section">
            <h3>📋 Survey Questions</h3>
            
            {surveyData.questions.map((question, index) => (
              <div key={question.id || index} className="question-block">
                <div className="question-header">
                  <h4>Question {index + 1}</h4>
                  {surveyData.questions.length > 1 && (
                    <button
                      type="button"
                      className="remove-question-btn"
                      onClick={() => removeQuestion(index)}
                    >
                      🗑️ Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Question Text *</label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    placeholder="Enter your question"
                    className={errors[`question_${index}`] ? 'error' : ''}
                  />
                  {errors[`question_${index}`] && (
                    <span className="error-text">{errors[`question_${index}`]}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Question Type</label>
                    <select
                      value={question.type}
                      onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                    >
                      {questionTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => handleQuestionChange(index, 'required', e.target.checked)}
                      />
                      Required Question
                    </label>
                  </div>
                </div>

                {/* Options for multiple choice, checkbox questions */}
                {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
                  <div className="options-section">
                    <label>Answer Options *</label>
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="option-input">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        {question.options.length > 2 && (
                          <button
                            type="button"
                            className="remove-option-btn"
                            onClick={() => removeOption(index, optionIndex)}
                          >
                            ❌
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-option-btn"
                      onClick={() => addOption(index)}
                    >
                      ➕ Add Option
                    </button>
                    {errors[`options_${index}`] && (
                      <span className="error-text">{errors[`options_${index}`]}</span>
                    )}
                  </div>
                )}

                {/* Preview for rating questions */}
                {question.type === 'rating' && (
                  <div className="rating-preview">
                    <label>Rating Preview:</label>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className="star">⭐</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button type="button" className="add-question-btn" onClick={addQuestion}>
              ➕ Add Another Question
            </button>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="draft-btn"
              onClick={saveDraft}
              disabled={loading}
            >
              💾 Save as Draft
            </button>
            
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? '⏳ Updating...' : '💾 Update Survey'}
            </button>
            
            <button
              type="button"
              className="publish-btn"
              onClick={publishSurvey}
              disabled={loading}
            >
              📢 Update & Publish
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSurvey;
