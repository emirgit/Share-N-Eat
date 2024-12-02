import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// This wil lbe changed to validate jwt token
const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token'); // Or retrieve token from context/store
  const location = useLocation();


  // Allow all paths that start with '/auth/'
  if (location.pathname.startsWith('/auth')) {
    return <Component {...rest} />;
  }

  // Redirect to login if no token and path is not under '/auth'
  return token ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/auth/login" replace />
  );
};

export default PrivateRoute;
