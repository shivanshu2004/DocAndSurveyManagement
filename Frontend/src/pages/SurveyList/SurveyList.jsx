import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSurvey } from '../../contexts/SurveyContext';
import Navbar from '../../Components/Navbar';
import './SurveyList.css';

const SurveyList = () => {
  const navigate = useNavigate();
  const { surveys, deleteSurvey, duplicateSurvey, updateSurvey, loading } = useSurvey();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredSurveys = surveys.filter(survey => {
    const matchesFilter = filter === 'all' || survey.status === filter;
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id) => {
    const result = await deleteSurvey(id);
    if (result.success) {
      setDeleteConfirm(null);
    }
  };

  const handleDuplicate = async (id) => {
    const result = await duplicateSurvey(id);
    if (result.success) {
      // Optionally navigate to edit the duplicated survey
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateSurvey(id, { status: newStatus });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { icon: '🟢', label: 'Active', class: 'status-active' },
      draft: { icon: '📝', label: 'Draft', class: 'status-draft' },
      completed: { icon: '✅', label: 'Completed', class: 'status-completed' },
      paused: { icon: '⏸️', label: 'Paused', class: 'status-paused' }
    };
    const badge = badges[status] || badges.draft;
    return (
      <span className={`status-badge ${badge.class}`}>
        {badge.icon} {badge.label}
      </span>
    );
  };

  return (
    <>
      <Navbar />
      <div className="survey-list-container">
        <div className="survey-list-header">
          <div className="header-content">
            <h1>📊 Survey Management</h1>
            <p>Manage all your surveys in one place</p>
          </div>
          <Link to="/create-survey" className="create-survey-btn">
            ➕ Create New Survey
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="survey-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search surveys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-tabs">
            {[
              { key: 'all', label: 'All Surveys', icon: '📋' },
              { key: 'active', label: 'Active', icon: '🟢' },
              { key: 'draft', label: 'Drafts', icon: '📝' },
              { key: 'completed', label: 'Completed', icon: '✅' }
            ].map(tab => (
              <button
                key={tab.key}
                className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Survey Grid */}
        <div className="surveys-grid">
          {filteredSurveys.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No surveys found</h3>
              <p>
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first survey to get started'
                }
              </p>
              {!searchTerm && filter === 'all' && (
                <Link to="/create-survey" className="create-first-survey-btn">
                  🚀 Create Your First Survey
                </Link>
              )}
            </div>
          ) : (
            filteredSurveys.map(survey => (
              <div key={survey.id} className="survey-card">
                <div className="survey-card-header">
                  <div className="survey-info">
                    <h3>{survey.title}</h3>
                    <p>{survey.description}</p>
                  </div>
                  {getStatusBadge(survey.status)}
                </div>

                <div className="survey-meta">
                  <div className="meta-item">
                    <span className="meta-icon">❓</span>
                    <span className="meta-value">{survey.questions?.length || 0} questions</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span className="meta-value">Created: {survey.createdAt}</span>
                  </div>
                </div>

                <div className="survey-actions">
                  <Link 
                    to={`/edit-survey/${survey.id}`}
                    className="action-btn edit-btn"
                  >
                    ✏️ Edit
                  </Link>
                  

                  
                  <button
                    className="action-btn duplicate-btn"
                    onClick={() => handleDuplicate(survey.id)}
                    disabled={loading}
                  >
                    📋 Duplicate
                  </button>

                  <div className="status-dropdown">
                    <select
                      value={survey.status}
                      onChange={(e) => handleStatusChange(survey.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="draft">📝 Draft</option>
                      <option value="active">🟢 Active</option>
                      <option value="paused">⏸️ Paused</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>

                  <button
                    className="action-btn delete-btn"
                    onClick={() => setDeleteConfirm(survey.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="modal-overlay">
            <div className="delete-modal">
              <h3>🗑️ Delete Survey</h3>
              <p>Are you sure you want to delete this survey? This action cannot be undone.</p>
              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-delete-btn"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete Survey'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SurveyList;
