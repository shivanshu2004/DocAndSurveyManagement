import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    const redirectPath = user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Component for admin-only routes
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
};

// Component for user-only routes
export const UserRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="user">
      {children}
    </ProtectedRoute>
  );
};

// Component for any authenticated user
export const AuthenticatedRoute = ({ children }) => {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
