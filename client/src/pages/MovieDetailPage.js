import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { moviesApi } from '../utils/api';
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
  CardContent,
  Container,
  Avatar,
  useTheme,
  useMediaQuery,
  Switch,
  FormControlLabel
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
import StarIcon from '@mui/icons-material/Star';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
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
  const [useTmdbData, setUseTmdbData] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        // Fetch movie with real-time TMDB data if enabled
        const movieData = useTmdbData 
          ? await moviesApi.getWithTmdbData(id)
          : await moviesApi.getById(id);
          
        console.log('Movie data:', movieData);
        setMovie(movieData);
        
        // After fetching the movie, get similar movies (same genres)
        if (movieData.genres && movieData.genres.length > 0) {
          const genreIds = movieData.genres.map(g => g._id).join(',');
          const similarRes = await moviesApi.getAll(1, { genres: genreIds });
          // Filter out the current movie
          const filteredMovies = similarRes.movies.filter(m => m._id !== id);
          setSimilarMovies(filteredMovies.slice(0, 10)); // Limit to 10 similar movies
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie details');
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, useTmdbData]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      await moviesApi.delete(id);
      navigate('/movies');
    } catch (err) {
      setError('Failed to delete movie');
    }
  };

  // Toggle between TMDB real-time data and database data
  const handleToggleTmdbData = () => {
    setUseTmdbData(!useTmdbData);
  };

  // Generate a stable rating based on movie title or use TMDB rating
  const generateRating = (title) => {
    const titleSum = title
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    return Math.min(5, Math.max(3.5, (titleSum % 15 + 35) / 10)).toFixed(1);
  };

  // Calculate a movie rating - use TMDB rating if available
  const movieRating = useMemo(() => {
    if (movie && movie.tmdbDataFound && movie.realTimeData?.vote_average) {
      return (movie.realTimeData.vote_average / 2).toFixed(1); // Convert 10-point scale to 5-point
    }
    return movie ? generateRating(movie.title) : 0;
  }, [movie]);

  // Director Info section
  const renderDirectorSection = () => {
    // Use TMDB director if available and enabled
    const directorInfo = (movie?.tmdbDataFound && useTmdbData && movie?.realTimeData?.director) 
      ? { name: movie.realTimeData.director.name, tmdbId: movie.realTimeData.director.tmdbId }
      : movie?.director;
    
    if (!directorInfo) {
      return (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3,
            background: 'linear-gradient(to right, #f5f5f5, #ffffff)'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            pb: 1
          }}>
            <PersonIcon sx={{ mr: 1 }} /> Director
          </Typography>
          <Typography variant="body1">No director information available</Typography>
        </Paper>
      );
    }

    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(to right, #f5f5f5, #ffffff)'
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            pb: 1
          }}
        >
          <PersonIcon sx={{ mr: 1 }} /> Director
          {movie?.tmdbDataFound && useTmdbData && (
            <Chip 
              size="small" 
              color="primary" 
              label="TMDB verified" 
              icon={<CloudSyncIcon />} 
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              mr: 2,
              bgcolor: theme.palette.primary.main
            }}
          >
            {directorInfo?.name?.charAt(0) || '?'}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {directorInfo?.name || 'Unknown'}
            </Typography>
            {directorInfo?.birthYear && (
              <Typography variant="body2" color="text.secondary">
                Born: {directorInfo.birthYear}
              </Typography>
            )}
          </Box>
        </Box>
        
        {directorInfo?.bio && (
          <Typography variant="body2" color="text.secondary" sx={{ 
            mt: 2,
            fontStyle: 'italic',
            lineHeight: 1.6,
            backgroundColor: 'rgba(0,0,0,0.03)',
            p: 2,
            borderRadius: 2
          }}>
            {directorInfo.bio}
          </Typography>
        )}
      </Paper>
    );
  };

  // Cast section
  const renderCastSection = () => {
    // Use TMDB cast if available and enabled
    const castInfo = (movie?.tmdbDataFound && useTmdbData && movie?.realTimeData?.cast) 
      ? movie.realTimeData.cast 
      : movie?.actors;
      
    if (!castInfo || castInfo.length === 0) {
      return (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff, #f9f9f9)'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            pb: 1,
            mb: 3
          }}>
            <LocalMoviesIcon sx={{ mr: 1 }} /> Cast
          </Typography>
          <Typography variant="body1">No cast information available</Typography>
        </Paper>
      );
    }

    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff, #f9f9f9)'
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            pb: 1,
            mb: 3
          }}
        >
          <LocalMoviesIcon sx={{ mr: 1 }} /> Cast
          {movie?.tmdbDataFound && useTmdbData && (
            <Chip 
              size="small" 
              color="primary" 
              label="TMDB verified" 
              icon={<CloudSyncIcon />} 
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        
        <Grid container spacing={3}>
          {castInfo.map((actor, index) => (
            <Grid item xs={12} sm={6} md={4} key={actor._id || actor.tmdbId || index}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(0,0,0,0.02)',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Avatar 
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : null}
                  sx={{ 
                    width: 56, 
                    height: 56, 
                    mr: 2,
                    bgcolor: theme.palette.secondary.main
                  }}
                >
                  {actor.name?.charAt(0) || '?'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {actor.name}
                  </Typography>
                  {actor.character && (
                    <Typography variant="body2" color="text.secondary">
                      as {actor.character}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading movie details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/movies')}
          sx={{ mt: 2 }}
        >
          Back to Movies
        </Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="warning">Movie not found</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/movies')}
          sx={{ mt: 2 }}
        >
          Back to Movies
        </Button>
      </Container>
    );
  }

  const poster = (movie.tmdbDataFound && useTmdbData && movie.realTimeData?.poster_path)
    ? `https://image.tmdb.org/t/p/w500${movie.realTimeData.poster_path}`
    : movie.poster;

  // Settings for the similar movies slider
  const sliderSettings = {
    dots: true,
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
          dots: true,
        }
      }
    ]
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Data source toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={useTmdbData}
              onChange={handleToggleTmdbData}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CloudSyncIcon sx={{ mr: 0.5 }} fontSize="small" />
              <Typography variant="body2">Use TMDB data</Typography>
            </Box>
          }
        />
      </Box>
      
      {/* Header with navigation and action buttons */}
      <Box sx={{ 
        mb: 4, 
        mt: 2,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="contained"
          component={Link} 
          to="/movies"
          fullWidth={isMobile}
          size="large"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            backgroundColor: theme.palette.grey[800],
            '&:hover': {
              backgroundColor: theme.palette.grey[900],
            }
          }}
        >
          Back to Movies
        </Button>
        
        {user && user.role === 'admin' && (
          <Box sx={{ display: 'flex', gap: 2, width: isMobile ? '100%' : 'auto' }}>
            <Button 
              startIcon={<EditIcon />} 
              variant="contained" 
              component={Link} 
              to={`/movies/${movie._id}/edit`}
              fullWidth={isMobile}
              size="large"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                backgroundColor: theme.palette.info.main,
                '&:hover': {
                  backgroundColor: theme.palette.info.dark,
                }
              }}
            >
              Edit Movie
            </Button>
            <Button 
              startIcon={<DeleteIcon />} 
              variant="contained" 
              color="error" 
              onClick={handleDelete}
              fullWidth={isMobile}
              size="large"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Delete Movie
            </Button>
          </Box>
        )}
      </Box>

      {/* Movie Hero Section */}
      <Paper 
        elevation={6} 
        sx={{ 
          mb: 5, 
          p: 0, 
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(to right, #1a237e, #311b92)',
          color: 'white',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.01)',
          }
        }}
      >
        <Box sx={{ position: 'relative', height: {xs: 300, sm: 400, md: 500} }}>
          <CardMedia
            component="img"
            image={poster}
            alt={movie.title}
            sx={{ 
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.35)'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://dummyimage.com/1600x900/e0e0e0/666666.jpg&text=${encodeURIComponent(movie.title)}`;
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0,
              width: '100%',
              p: { xs: 3, md: 5 },
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%)',
              zIndex: 1
            }}
          >
            <Typography 
              variant={isMobile ? "h4" : "h2"} 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                letterSpacing: 1
              }}
            >
              {movie.title}
            </Typography>
            
            <Stack 
              direction={isMobile ? "column" : "row"} 
              spacing={3} 
              alignItems={isMobile ? "flex-start" : "center"} 
              sx={{ mb: 3 }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(0,0,0,0.3)', 
                p: 1, 
                borderRadius: 2,
                px: 2
              }}>
                <StarIcon sx={{ color: '#FFD700', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {movieRating}
                </Typography>
                <Typography variant="body2" sx={{ ml: 0.5, opacity: 0.8 }}>
                  /5
                </Typography>
              </Box>
              
              <Chip 
                icon={<CalendarMonthIcon />} 
                label={movie.releaseYear} 
                variant="filled"
                sx={{ 
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.15)', 
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' },
                  py: 1,
                  fontWeight: 'bold'
                }}
              />
              
              <Chip 
                icon={<AccessTimeIcon />} 
                label={`${movie.runtime} min`} 
                variant="filled"
                sx={{ 
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.15)', 
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' },
                  py: 1,
                  fontWeight: 'bold'
                }}
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
                    fontWeight: 'medium',
                    borderRadius: 2,
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
          <Card 
            sx={{ 
              mb: 4, 
              borderRadius: 3, 
              overflow: 'hidden',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              height: 'fit-content'
            }}
          >
            <CardMedia
              component="img"
              height="auto"
              image={poster}
              alt={movie.title}
              sx={{ 
                objectFit: 'cover',
                aspectRatio: '2/3',
                width: '100%',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)'
                }
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://dummyimage.com/300x450/e0e0e0/666666.jpg&text=${encodeURIComponent(movie.title)}`;
              }}
            />
          </Card>
          
          {/* Director Info - use the renderer function */}
          {renderDirectorSection()}
        </Grid>
        
        {/* Right Column - Details */}
        <Grid item xs={12} md={8}>
          {/* Plot */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff, #f9f9f9)'
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                pb: 1,
                mb: 3
              }}
            >
              <TheatersIcon sx={{ mr: 1 }} /> Plot
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                lineHeight: 1.8,
                fontSize: '1.05rem',
                letterSpacing: 0.3
              }}
            >
              {movie.plot}
            </Typography>
          </Paper>
          
          {/* Cast - use the renderer function */}
          {renderCastSection()}
          
          {/* Technical Info */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff, #f9f9f9)'
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                pb: 1,
                mb: 3
              }}
            >
              Technical Info
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(0,0,0,0.03)',
                  height: '100%'
                }}>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                    Release Year
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <CalendarMonthIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    {movie.releaseYear}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(0,0,0,0.03)',
                  height: '100%'
                }}>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                    Runtime
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    {movie.runtime} minutes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(0,0,0,0.03)'
                }}>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                    Genres
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {movie.genres && movie.genres.map(genre => (
                      <Chip 
                        key={genre._id} 
                        label={genre.name} 
                        color="primary" 
                        sx={{ 
                          borderRadius: 2,
                          fontWeight: 'medium',
                          py: 2
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 4, 
              fontWeight: 'bold',
              textAlign: 'center',
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '60px',
                height: '4px',
                backgroundColor: theme.palette.primary.main,
                margin: '12px auto 0'
              }
            }}
          >
            Similar Movies You May Like
          </Typography>
          
          <Box sx={{ 
            '.slick-prev:before, .slick-next:before': {
              color: theme.palette.primary.main,
              fontSize: '30px',
            },
            '.slick-prev, .slick-next': {
              zIndex: 1,
              height: '40px',
              width: '40px',
            },
            '.slick-dots li button:before': {
              fontSize: '12px',
              color: theme.palette.primary.main
            }
          }}>
            <Slider {...sliderSettings}>
              {similarMovies.map(similarMovie => {
                // Generate a stable rating for similar movies
                const similarRating = generateRating(similarMovie.title);
                
                return (
                  <Box key={similarMovie._id} sx={{ px: 1.5, py: 2 }}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                        },
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Link 
                        to={`/movies/${similarMovie._id}`} 
                        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="260"
                            image={
                              similarMovie.poster && similarMovie.poster !== 'no-image.jpg' 
                                ? similarMovie.poster 
                                : `https://dummyimage.com/300x450/e0e0e0/666666.jpg&text=${encodeURIComponent(similarMovie.title)}`
                            }
                            alt={similarMovie.title}
                            sx={{ objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://dummyimage.com/300x450/e0e0e0/666666.jpg&text=${encodeURIComponent(similarMovie.title)}`;
                            }}
                          />
                          <Box sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10, 
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            borderRadius: '12px',
                            px: 1.5,
                            py: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold'
                          }}>
                            <StarIcon sx={{ color: '#FFD700', fontSize: '0.9rem', mr: 0.5 }} />
                            <Typography variant="body2">
                              {similarRating}
                            </Typography>
                          </Box>
                        </Box>
                        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                          <Typography 
                            variant="h6" 
                            gutterBottom 
                            noWrap 
                            title={similarMovie.title}
                            sx={{ fontWeight: 'bold', mb: 1.5 }}
                          >
                            {similarMovie.title}
                          </Typography>
                          
                          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                            {similarMovie.releaseYear && (
                              <Chip 
                                size="small"
                                icon={<CalendarMonthIcon fontSize="small" />} 
                                label={similarMovie.releaseYear} 
                                sx={{ 
                                  fontWeight: 'medium',
                                  borderRadius: 1.5
                                }}
                              />
                            )}
                            {similarMovie.runtime && (
                              <Chip 
                                size="small"
                                icon={<AccessTimeIcon fontSize="small" />} 
                                label={`${similarMovie.runtime} min`} 
                                sx={{ 
                                  fontWeight: 'medium',
                                  borderRadius: 1.5
                                }}
                              />
                            )}
                          </Stack>
                          
                          {similarMovie.director && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              noWrap
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <PersonIcon sx={{ fontSize: '0.9rem', mr: 0.5, opacity: 0.7 }} />
                              {similarMovie.director?.name || 'Unknown'}
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
    </Container>
  );
};

export default MovieDetailPage; 