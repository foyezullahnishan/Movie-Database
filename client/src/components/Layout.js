import React from 'react';
import Navbar from './Navbar';
import { Box, Container } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ py: 4, flexGrow: 1 }}>
        {children}
      </Container>
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[100],
          textAlign: 'center',
          fontSize: '0.875rem',
          color: (theme) => theme.palette.text.secondary
        }}
      >
        &copy; {new Date().getFullYear()} Movie Database
      </Box>
    </Box>
  );
};

export default Layout; 