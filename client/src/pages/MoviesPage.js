import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Typography, 
  Button, 
  Grid, 
  Box, 
  Alert, 
  CircularProgress,
  TextField,
  InputAdornment,
  Container,
  Fab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MovieListItem from '../components/MovieListItem';

const MoviesPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Reference to observe the last movie element
  const observer = useRef();
  const lastMovieElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('Loading more movies');
        setPage(prevPage => prevPage + 1);
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Initial data load and search term changes
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      setPage(1);
      setIsSearching(true);
      
      try {
        const url = searchTerm 
          ? `/api/movies?page=1&keyword=${encodeURIComponent(searchTerm)}`
          : `/api/movies?page=1`;
          
        console.log('Loading initial data from URL:', url);
        const res = await axios.get(url);
        
        setMovies(res.data.movies);
        setHasMore(res.data.page < res.data.pages);
        setInitialLoading(false);
        setIsSearching(false);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load movies');
        setInitialLoading(false);
        setIsSearching(false);
      }
    };
    
    const delaySearch = setTimeout(() => {
      loadInitialData();
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // Load more data when page changes (only if not searching/filtering)
  useEffect(() => {
    const loadMoreData = async () => {
      if (page === 1 || isSearching) return; // Skip if it's the first page or we're searching
      
      setLoading(true);
      
      try {
        const url = searchTerm 
          ? `/api/movies?page=${page}&keyword=${encodeURIComponent(searchTerm)}`
          : `/api/movies?page=${page}`;
          
        console.log('Loading more data from URL:', url);
        const res = await axios.get(url);
        
        setMovies(prevMovies => [...prevMovies, ...res.data.movies]);
        setHasMore(res.data.page < res.data.pages);
        setLoading(false);
      } catch (err) {
        console.error('Error loading more data:', err);
        setError('Failed to load more movies');
        setLoading(false);
      }
    };
    
    loadMoreData();
  }, [page, isSearching]);

  // Show scroll to top button when scrolled down
  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScrollTop]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      await axios.delete(`/api/movies/${id}`);
      setMovies(movies.filter(m => m._id !== id));
    } catch (err) {
      setError('Failed to delete movie');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Movies</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search movies..."
            size="small"
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
            >
              Add Movie
            </Button>
          )}
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {initialLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : movies.length === 0 ? (
        <Alert severity="info">No movies found</Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {movies.map((movie, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3} 
                key={movie._id}
                ref={index === movies.length - 1 ? lastMovieElementRef : null}
              >
                <MovieListItem movie={movie} />
              </Grid>
            ))}
          </Grid>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {!hasMore && movies.length > 0 && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography color="textSecondary">
                No more movies to load
              </Typography>
            </Box>
          )}
          
          {showScrollTop && (
            <Fab 
              color="primary" 
              size="small" 
              onClick={scrollToTop} 
              sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
              <KeyboardArrowUpIcon />
            </Fab>
          )}
        </>
      )}
    </Container>
  );
};

export default MoviesPage;
