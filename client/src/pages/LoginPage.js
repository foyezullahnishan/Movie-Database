import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert,
  Paper,
  CircularProgress,
  Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MovieIcon from '@mui/icons-material/Movie';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const { login, user, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to movies page
    if (user) {
      navigate('/movies');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear errors when user types
    if (formError) setFormError('');
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Form validation
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      navigate('/movies');
    } catch (err) {
      // Error is handled in the auth context
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 8, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', mb: 2 }}>
            <LockOutlinedIcon />
          </Avatar>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MovieIcon color="primary" sx={{ mr: 1 }} />
            <Typography component="h1" variant="h4" align="center">
              Movie Database
            </Typography>
          </Box>
          
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
        </Box>
        
        {(error || formError) && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {formError || error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'none', color: 'primary.main' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Movie Database
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
