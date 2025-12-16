import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && user?.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <span className="access-denied-icon">🚫</span>
          <h2>Access Denied</h2>
          <p>You do not have permission to access this page.</p>
          <p className="required-role">Required role: {requiredRole}</p>
          <Navigate to="/home" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
