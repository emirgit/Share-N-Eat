import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axiosHelper from '../axiosHelper';

// This wil lbe changed to validate jwt token
const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token'); // Or retrieve token from context/store
  const location = useLocation();
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(null);

  // Fetch roles if the path starts with '/admin'
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      const fetchRoles = async () => {
        try {
          const data = await axiosHelper('/user/my-account/roles', 'GET'); // Replace with your endpoint
          setRoles(data);
        } catch (error) {
          console.error('Error fetching user roles:', error);
          setRolesError('Failed to load user roles.');
        } finally {
          setRolesLoading(false);
        }
      };

      fetchRoles();
    } else {
      setRolesLoading(false); // Skip role fetching for non-admin paths
    }
  }, [location.pathname]);

  // Allow all paths that start with '/auth/'
  if (location.pathname.startsWith('/auth')) {
    return <Component {...rest} />;
  }

  // Redirect to login if no token and path is not under '/auth'
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Show a loading indicator while roles are being fetched for '/admin' routes
  if (rolesLoading) {
    return <div>Loading...</div>;
  }

  // Handle role-based access for '/admin' routes
  if (location.pathname.startsWith('/admin')) {
    if (rolesError) {
      return <div>{rolesError}</div>; // Display error if roles fail to load
    }

    // Check if the user has the 'admin' role
    if (!roles.includes('ROLE_ADMIN')) {
      return <Navigate to="/" replace />; // Redirect if user is not an admin
    }
  }

  // Render the component if all checks pass
  return <Component {...rest} />;
};

export default PrivateRoute;
