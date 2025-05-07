import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Alert, Box, Typography } from '@mui/material';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If admin access required but user is not admin
  if (adminOnly && user.role !== 'admin') {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Access Denied
        </Alert>
        <Typography variant="body1">
          You don't have permission to access this page.
        </Typography>
      </Box>
    );
  }

  // If authorized, render the children
  return children;
};

export default ProtectedRoute; 