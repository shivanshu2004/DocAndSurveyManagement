import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SurveyProvider } from './contexts/SurveyContext';
import Login from './pages/Login/Login';
import UserLogin from './pages/UserLogin/UserLogin';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import Register from './pages/Register/Register';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import CreateSurvey from './pages/CreateSurvey';
import SurveyList from './pages/SurveyList/SurveyList';
import EditSurvey from './pages/EditSurvey/EditSurvey';
import TakeSurvey from './pages/TakeSurvey';
import GiveFeedback from './pages/GiveFeedback';
import ProvideFeedback from './pages/ProvideFeedback';
import SurveyHistory from './pages/SurveyHistory';

import AdminPanel from './pages/AdminPanel';
import { AdminRoute, UserRoute, AuthenticatedRoute } from './components/ProtectedRoute';
import './App.css';

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid rgba(255,255,255,0.3)',
        borderTop: '3px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }}></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Main App Routes Component
function AppRoutes() {
  const { isAuthenticated, isAdmin, isUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated() ? (
            <Navigate to={isAdmin() ? "/admin-dashboard" : "/user-dashboard"} replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/user-login"
        element={
          isAuthenticated() ? (
            <Navigate to="/user-dashboard" replace />
          ) : (
            <UserLogin />
          )
        }
      />

      <Route
        path="/admin-login"
        element={
          isAuthenticated() ? (
            <Navigate to="/admin-dashboard" replace />
          ) : (
            <AdminLogin />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated() ? (
            <Navigate to={isAdmin() ? "/admin-dashboard" : "/user-dashboard"} replace />
          ) : (
            <Register />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/user-dashboard"
        element={
          <UserRoute>
            <UserDashboard />
          </UserRoute>
        }
      />

      {/* Admin-only routes */}
      <Route
        path="/create-survey"
        element={
          <AdminRoute>
            <CreateSurvey />
          </AdminRoute>
        }
      />

      <Route
        path="/survey-list"
        element={
          <AdminRoute>
            <SurveyList />
          </AdminRoute>
        }
      />

      <Route
        path="/edit-survey/:id"
        element={
          <AdminRoute>
            <EditSurvey />
          </AdminRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />

      {/* User-only routes */}
      <Route
        path="/take-survey"
        element={
          <UserRoute>
            <TakeSurvey />
          </UserRoute>
        }
      />

      <Route
        path="/give-feedback/:id"
        element={
          <UserRoute>
            <GiveFeedback />
          </UserRoute>
        }
      />

      <Route
        path="/provide-feedback"
        element={
          <UserRoute>
            <ProvideFeedback />
          </UserRoute>
        }
      />

      <Route
        path="/survey-history"
        element={
          <UserRoute>
            <SurveyHistory />
          </UserRoute>
        }
      />

      {/* Default route - redirect based on authentication */}
      <Route
        path="/"
        element={
          isAuthenticated() ? (
            <Navigate to={isAdmin() ? "/admin-dashboard" : "/user-dashboard"} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch all route */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated() ? (isAdmin() ? "/admin-dashboard" : "/user-dashboard") : "/login"} replace />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SurveyProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SurveyProvider>
    </AuthProvider>
  );
}

export default App;
