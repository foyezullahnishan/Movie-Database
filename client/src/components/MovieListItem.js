import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Chip, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const MovieListItem = ({ movie }) => {
  const [imgError, setImgError] = useState(false);

  // Generate a stable rating based on movie ID or title instead of random
  const rating = useMemo(() => {
    // Use the movie title to generate a consistent rating
    const titleSum = movie.title
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    // Generate a rating between 3.5 and 5.0 based on the title
    return Math.min(5, Math.max(3.5, (titleSum % 15 + 35) / 10));
  }, [movie.title]);

  // Process the poster URL with improved handling
  const posterUrl = useMemo(() => {
    // If we've already tried and failed to load the image, use placeholder
    if (imgError) {
      return `https://dummyimage.com/300x450/e0e0e0/666666.jpg&text=${encodeURIComponent(movie.title)}`;
    }

    // Handle missing or placeholder posters
    if (!movie.poster || movie.poster === 'no-image.jpg' || movie.poster === 'null') {
      return `https://dummyimage.com/300x450/e0e0e0/666666.jpg&text=${encodeURIComponent(movie.title)}`;
    }
    
    // Handle IMDb media viewer URLs (which are not direct image URLs)
    if (movie.poster.includes('imdb.com') && movie.poster.includes('mediaviewer')) {
      console.log("Detected IMDb mediaviewer URL - using placeholder instead");
      return `https://dummyimage.com/300x450/e0e0e0/666666.jpg&text=${encodeURIComponent(movie.title)}`;
    }
    
    // Handle TMDb relative paths
    if (movie.poster.startsWith('/')) {
      return `https://image.tmdb.org/t/p/w500${movie.poster}`;
    }
    
    // Sometimes TMDb paths might be stored with the base URL but missing the size
    if (movie.poster.includes('image.tmdb.org/t/p') && !movie.poster.includes('/w')) {
      // Extract the path and add the size
      const path = movie.poster.split('image.tmdb.org/t/p')[1];
      return `https://image.tmdb.org/t/p/w500${path}`;
    }
    
    // Return the poster as is for all other cases
    return movie.poster;
  }, [movie.poster, movie.title, imgError]);

  const handleImageError = () => {
    console.log("Image failed to load:", movie.poster);
    setImgError(true);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
        },
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
            image={posterUrl}
            alt={movie.title}
            sx={{ objectFit: 'cover' }}
            onError={handleImageError}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              borderRadius: 2,
              p: 0.5,
              px: 1,
              fontSize: '0.875rem',
              fontWeight: 'bold',
            }}
          >
            {movie.releaseYear}
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {movie.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating name="read-only" value={rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              {rating.toFixed(1)}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1.5, flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {movie.director?.name || 'Unknown director'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {movie.runtime} min
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {movie.genres && movie.genres.map((genre, index) => (
              <Chip 
                key={genre._id || index} 
                label={genre.name} 
                size="small" 
                sx={{ 
                  mb: 0.5, 
                  bgcolor: 'primary.light', 
                  color: 'primary.contrastText',
                  fontSize: '0.7rem',
                  height: 24
                }} 
              />
            ))}
          </Stack>
        </CardContent>
      </Link>
    </Card>
  );
};

export default MovieListItem; 