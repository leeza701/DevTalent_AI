import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, token } = useContext(AuthContext);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50">Loading profile...</div>;
  }

  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If the user's role is not within the specific route's allowed set, redirect to their dashboard home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
