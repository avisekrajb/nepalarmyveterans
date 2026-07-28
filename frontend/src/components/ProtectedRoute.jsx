import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, isSuperAdmin = false }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  // Check for super admin token
  if (isSuperAdmin) {
    const superToken = localStorage.getItem('superToken');
    const superAdmin = localStorage.getItem('superAdmin');
    if (!superToken || !superAdmin) {
      return <Navigate to="/superadmin/login" />;
    }
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;