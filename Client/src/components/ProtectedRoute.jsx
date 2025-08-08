
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // If there's a token, render the child route.
  // The <Outlet /> component from react-router-dom will render the matched child route element.
  // If not, navigate to the login page, replacing the current entry in the history.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
