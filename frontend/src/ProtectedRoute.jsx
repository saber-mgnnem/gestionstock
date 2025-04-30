import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// ProtectedRoute component that checks authentication status and role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user')); // Assuming you store the user in localStorage after login

  if (!user) {
    // If no user is logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  // Check if user role matches allowed roles
  if (!allowedRoles.includes(user.role)) {
    // If the role is not allowed, redirect to an error page or another route
    return <Navigate to="/unauthorized" />;
  }

  // If user is authenticated and has an allowed role, render the children (protected route content)
  return children;
};

export default ProtectedRoute;
