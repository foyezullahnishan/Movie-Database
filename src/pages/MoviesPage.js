import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Box, 
  Alert, 
  CardMedia,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  Rating,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const MoviesPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Use searchTerm in the API call if present
        const url = searchTerm 
          ? `/api/movies?page=${page}&keyword=${encodeURIComponent(searchTerm)}`
          : `/api/movies?page=${page}`;
          
        const res = await axios.get(url);
        setMovies(res.data.movies);
        setTotalPages(res.data.pages);
        setLoading(false);
      } catch (err) {
        setError('Failed to load movies');
        setLoading(false);
      }
    };

    // Use a debounce for search
    const timeoutId = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [page, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      await axios.delete(`/api/movies/${id}`);
      setMovies(movies.filter(m => m._id !== id));
    } catch (err) {
      setError('Failed to delete movie');
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset to first page when searching
    setPage(1);
  };

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        mb: 4,
        gap: 2
      }}>
        <Typography variant="h4">Movies</Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          width: isMobile ? '100%' : 'auto',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <TextField
            placeholder="Search movies..."
            size="small"
            fullWidth={isMobile}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {user && user.role === 'admin' && (
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/movies/new"
              startIcon={<AddIcon />}
              fullWidth={isMobile}
            >
              Add Movie
            </Button>
          )}
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : movies.length === 0 ? (
        <Alert severity="info">
          {searchTerm ? 'No movies found matching your search' : 'No movies found'}
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {movies.map(movie => {
              // Generate a random rating between 3.5 and 5
              const randomRating = (Math.random() * 1.5 + 3.5).toFixed(1);
              
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                      },
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Link 
                      to={`/movies/${movie._id}`} 
                      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="300"
                          image={
                            movie.poster !== 'no-image.jpg' 
                              ? movie.poster 
                              : `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}`
                          }
                          alt={movie.title}
                          sx={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}`;
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        <Typography variant="h6" gutterBottom noWrap title={movie.title}>
                          {movie.title}
                        </Typography>
                        
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Rating value={parseFloat(randomRating)} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary">
                            {randomRating}
                          </Typography>
                        </Stack>
                        
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                          {movie.releaseYear && (
                            <Chip 
                              icon={<CalendarTodayIcon fontSize="small" />} 
                              label={movie.releaseYear} 
                              size="small" 
                              variant="outlined"
                            />
                          )}
                          {movie.runtime && (
                            <Chip 
                              icon={<AccessTimeIcon fontSize="small" />} 
                              label={`${movie.runtime} min`} 
                              size="small" 
                              variant="outlined"
                            />
                          )}
                        </Stack>
                        
                        {movie.director && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Director:</strong> {movie.director?.name || 'Unknown'}
                          </Typography>
                        )}
                        
                        <Box sx={{ mt: 1, height: 40, overflow: 'hidden' }}>
                          {movie.genres && movie.genres.slice(0, 3).map(genre => (
                            <Chip 
                              key={genre._id} 
                              label={genre.name} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }} 
                            />
                          ))}
                          {movie.genres && movie.genres.length > 3 && (
                            <Chip 
                              label={`+${movie.genres.length - 3} more`} 
                              size="small" 
                              variant="outlined"
                              sx={{ mr: 0.5, mb: 0.5 }} 
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Link>
                    
                    <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
                      <Button 
                        size="small" 
                        component={Link} 
                        to={`/movies/${movie._id}`}
                        color="primary"
                      >
                        View Details
                      </Button>
                      
                      {user && user.role === 'admin' && (
                        <Box>
                          <Button 
                            size="small" 
                            component={Link} 
                            to={`/movies/${movie._id}/edit`}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            color="error" 
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(movie._id);
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default MoviesPage; 