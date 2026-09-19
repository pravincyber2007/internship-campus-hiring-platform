import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user_id'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');

  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole('');
  };

  return (
    <Router>
      <Routes>
        {/* Root Route: Shows Landing Page if logged out, or redirects to Dashboard if logged in */}
        <Route path="/" element={
          !isAuthenticated ? (
            <LandingPage isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
          ) : userRole === 'student' ? (
            <Navigate to="/student/dashboard" />
          ) : userRole === 'company' ? (
            <Navigate to="/company/dashboard" />
          ) : userRole === 'admin' ? (
            <Navigate to="/admin/dashboard" />
          ) : (
            <LandingPage isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
          )
        } />

        {/* Dedicated Sign In / Register Page */}
        <Route path="/auth" element={<AuthPage isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />} />
        
        {/* Role Dashboards */}
        <Route path="/student/dashboard" element={isAuthenticated && userRole === 'student' ? <StudentDashboard isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
        
        <Route path="/company/dashboard" element={isAuthenticated && userRole === 'company' ? <CompanyDashboard isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
        
        <Route path="/admin/dashboard" element={isAuthenticated && userRole === 'admin' ? <AdminDashboard isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}