import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Decode JWT token to check authentication and get user role
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (payload.exp < currentTime) {
        console.log('Token expired');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoading(false);
        return;
      }

      // Token is valid
      setIsAuthenticated(true);
      setUserRole(payload.role);
    } catch (error) {
      console.error('Token validation failed:', error);
      // Clear invalid token
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Your role: {userRole}</p>
        <p>Required role: {requiredRole}</p>
        <button onClick={() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }}>
          Go to Login
        </button>
      </div>
    );
  }

  // Authenticated and has correct role
  return children;
};

export default ProtectedRoute;