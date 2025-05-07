import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Typography, 
  Button, 
  Box, 
  Alert,
  Grid, 
  Paper,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Rating,
  Card,
  CardMedia,
  IconButton,
  Stack,
  Tooltip,
  CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import TheatersIcon from '@mui/icons-material/Theaters';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/movies/${id}`);
        setMovie(res.data);
        
        // After fetching the movie, get similar movies (same genres)
        if (res.data.genres && res.data.genres.length > 0) {
          const genreIds = res.data.genres.map(g => g._id).join(',');
          const similarRes = await axios.get(`/api/movies?page=1&genres=${genreIds}`);
          // Filter out the current movie
          const filteredMovies = similarRes.data.movies.filter(m => m._id !== id);
          setSimilarMovies(filteredMovies.slice(0, 10)); // Limit to 10 similar movies
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load movie details');
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      await axios.delete(`/api/movies/${id}`);
      navigate('/movies');
    } catch (err) {
      setError('Failed to delete movie');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          component={Link} 
          to="/movies" 
          sx={{ mt: 2 }}
        >
          Back to Movies
        </Button>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="info">Movie not found</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          component={Link} 
          to="/movies" 
          sx={{ mt: 2 }}
        >
          Back to Movies
        </Button>
      </Box>
    );
  }

  // Generate a random rating between 3.5 and 5
  const randomRating = (Math.random() * 1.5 + 3.5).toFixed(1);

  // Settings for the similar movies slider
  const sliderSettings = {
    dots: false,
    infinite: similarMovies.length > 4,
    speed: 500,
    slidesToShow: Math.min(4, similarMovies.length),
    slidesToScroll: 1,
    nextArrow: <NavigateNextIcon color="primary" />,
    prevArrow: <NavigateBeforeIcon color="primary" />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(3, similarMovies.length),
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(2, similarMovies.length),
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <Box>
      {/* Header with navigation and action buttons */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="outlined"
          component={Link} 
          to="/movies"
        >
          Back to Movies
        </Button>
        
        {user && user.role === 'admin' && (
          <Box>
            <Button 
              startIcon={<EditIcon />} 
              variant="outlined" 
              component={Link} 
              to={`/movies/${movie._id}/edit`}
              sx={{ mr: 2 }}
            >
              Edit
            </Button>
            <Button 
              startIcon={<DeleteIcon />} 
              variant="outlined" 
              color="error" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      {/* Movie Hero Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 4, 
          p: 0, 
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#303030',
          color: 'white',
        }}
      >
        <Box sx={{ position: 'relative', height: {xs: 250, md: 400} }}>
          <CardMedia
            component="img"
            image={movie.poster !== 'no-image.jpg' ? movie.poster : `https://via.placeholder.com/1600x900?text=${encodeURIComponent(movie.title)}`}
            alt={movie.title}
            sx={{ 
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.4)'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/1600x900?text=${encodeURIComponent(movie.title)}`;
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0,
              width: '100%',
              p: 3,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)',
              zIndex: 1
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              {movie.title}
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={parseFloat(randomRating)} precision={0.1} readOnly />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {randomRating}/5
                </Typography>
              </Box>
              
              <Chip 
                icon={<CalendarMonthIcon />} 
                label={movie.releaseYear} 
                variant="outlined"
                sx={{ borderColor: 'white', color: 'white' }}
              />
              
              <Chip 
                icon={<AccessTimeIcon />} 
                label={`${movie.runtime} min`} 
                variant="outlined"
                sx={{ borderColor: 'white', color: 'white' }}
              />
            </Stack>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {movie.genres && movie.genres.map(genre => (
                <Chip 
                  key={genre._id} 
                  label={genre.name} 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }} 
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column - Poster */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              image={movie.poster !== 'no-image.jpg' ? movie.poster : `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}`}
              alt={movie.title}
              sx={{ height: 'auto', width: '100%' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}`;
              }}
            />
          </Card>
          
          {/* Director Info */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1 }} /> Director
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {movie.director?.name || 'Unknown'}
            </Typography>
            {movie.director?.birthYear && (
              <Typography variant="body2" color="text.secondary">
                Born: {movie.director.birthYear}
              </Typography>
            )}
            {movie.director?.bio && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {movie.director.bio}
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Right Column - Details */}
        <Grid item xs={12} md={8}>
          {/* Plot */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TheatersIcon sx={{ mr: 1 }} /> Plot
            </Typography>
            <Typography variant="body1" paragraph>
              {movie.plot}
            </Typography>
          </Paper>
          
          {/* Cast */}
          {movie.actors && movie.actors.length > 0 && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalMoviesIcon sx={{ mr: 1 }} /> Cast
              </Typography>
              <Grid container spacing={2}>
                {movie.actors.map(actor => (
                  <Grid item xs={12} sm={6} key={actor._id}>
                    <Card sx={{ 
                      display: 'flex', 
                      height: '100%',
                      flexDirection: 'column',
                      borderRadius: 2
                    }}>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h6">{actor.name}</Typography>
                        {actor.birthYear && (
                          <Typography variant="body2" color="text.secondary">
                            Born: {actor.birthYear}
                          </Typography>
                        )}
                        {actor.bio && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {actor.bio.substring(0, 150)}
                            {actor.bio.length > 150 ? '...' : ''}
                          </Typography>
                        )}
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
          
          {/* Technical Info */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Technical Info
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="text.secondary">Release Year</Typography>
                <Typography variant="body1">{movie.releaseYear}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="text.secondary">Runtime</Typography>
                <Typography variant="body1">{movie.runtime} minutes</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary">Genres</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {movie.genres && movie.genres.map(genre => (
                    <Chip 
                      key={genre._id} 
                      label={genre.name} 
                      color="primary" 
                      variant="outlined" 
                      size="small" 
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Similar Movies You May Like
          </Typography>
          
          <Box sx={{ 
            '.slick-prev:before, .slick-next:before': {
              color: 'primary.main',
            },
            '.slick-prev, .slick-next': {
              zIndex: 1
            }
          }}>
            <Slider {...sliderSettings}>
              {similarMovies.map(similarMovie => {
                // Generate a random rating for similar movies
                const similarRating = (Math.random() * 1.5 + 3.5).toFixed(1);
                
                return (
                  <Box key={similarMovie._id} sx={{ px: 1 }}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                        },
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <Link 
                        to={`/movies/${similarMovie._id}`} 
                        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
                      >
                        <CardMedia
                          component="img"
                          height="250"
                          image={
                            similarMovie.poster !== 'no-image.jpg' 
                              ? similarMovie.poster 
                              : `https://via.placeholder.com/300x450?text=${encodeURIComponent(similarMovie.title)}`
                          }
                          alt={similarMovie.title}
                          sx={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(similarMovie.title)}`;
                          }}
                        />
                        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                          <Typography variant="h6" gutterBottom noWrap title={similarMovie.title}>
                            {similarMovie.title}
                          </Typography>
                          
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Rating value={parseFloat(similarRating)} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary">
                              {similarRating}
                            </Typography>
                          </Stack>
                          
                          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            {similarMovie.releaseYear && (
                              <Chip 
                                icon={<CalendarMonthIcon fontSize="small" />} 
                                label={similarMovie.releaseYear} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                          </Stack>
                          
                          {similarMovie.director && (
                            <Typography variant="body2" color="text.secondary" noWrap>
                              <strong>Director:</strong> {similarMovie.director?.name || 'Unknown'}
                            </Typography>
                          )}
                        </CardContent>
                      </Link>
                    </Card>
                  </Box>
                );
              })}
            </Slider>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MovieDetailPage; 