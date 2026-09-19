import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ isAuthenticated, allowedRole, userRole, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}