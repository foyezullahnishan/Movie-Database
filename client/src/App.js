import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MoviesPage from './pages/MoviesPage';
import MovieFormPage from './pages/MovieFormPage';
import MovieDetailPage from './pages/MovieDetailPage';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { darkMode } = useTheme();

  // Create a theme based on darkMode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={<Layout><ProtectedRoute><MoviesPage /></ProtectedRoute></Layout>} />
            <Route path="/movies" element={<Layout><ProtectedRoute><MoviesPage /></ProtectedRoute></Layout>} />
            <Route path="/movies/new" element={<Layout><ProtectedRoute adminOnly={true}><MovieFormPage /></ProtectedRoute></Layout>} />
            <Route path="/movies/:id" element={<Layout><ProtectedRoute><MovieDetailPage /></ProtectedRoute></Layout>} />
            <Route path="/movies/:id/edit" element={<Layout><ProtectedRoute adminOnly={true}><MovieFormPage /></ProtectedRoute></Layout>} />
            <Route path="/admin" element={<Layout><ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute></Layout>} />
            
            <Route path="*" element={<Navigate to="/movies" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
