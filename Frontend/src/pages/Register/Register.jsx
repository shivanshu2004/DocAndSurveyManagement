import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'user';
  const isAdmin = userType === 'admin';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: isAdmin ? 'admin' : 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await register({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });
    
    if (result.success) {
      navigate(formData.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className={`register-container ${isAdmin ? 'admin-theme' : 'user-theme'}`}>
      <div className="register-card">
        <div className="register-header">
          <div className="back-button">
            <Link to="/login" className="back-link">← Back to Portal</Link>
          </div>

          <div className={`register-icon ${isAdmin ? 'admin-icon' : 'user-icon'}`}>
            {isAdmin ? '🔧' : '👤'}
          </div>

          <h1>{isAdmin ? 'Admin' : 'User'} Registration</h1>
          <p>Create your {isAdmin ? 'admin' : 'user'} account</p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`register-btn ${isAdmin ? 'admin-btn' : 'user-btn'}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : `Create ${isAdmin ? 'Admin' : 'User'} Account`}
          </button>
        </form>

        <div className="login-link">
          <p>
            Already have an account?
            <Link to={isAdmin ? '/admin-login' : '/user-login'}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
