import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MovieFormPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  const [movie, setMovie] = useState({
    title: '',
    releaseYear: '',
    plot: '',
    runtime: '',
    director: '',
    actors: [],
    genres: [],
    poster: ''
  });
  const [directors, setDirectors] = useState([]);
  const [actors, setActors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Fetch movie data for editing
  useEffect(() => {
    // Fetch reference data (directors, actors, genres)
    const fetchReferenceData = async () => {
      try {
        const [directorsRes, actorsRes, genresRes] = await Promise.all([
          axios.get('/api/directors'),
          axios.get('/api/actors'),
          axios.get('/api/genres')
        ]);
        
        setDirectors(directorsRes.data);
        setActors(actorsRes.data);
        setGenres(genresRes.data);
      } catch (err) {
        setError('Failed to load reference data');
      }
    };

    // Fetch movie data if in edit mode
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/api/movies/${id}`);
        // Transform movie data for form
        setMovie({
          title: res.data.title,
          releaseYear: res.data.releaseYear,
          plot: res.data.plot,
          runtime: res.data.runtime,
          director: res.data.director._id,
          actors: res.data.actors.map(actor => actor._id),
          genres: res.data.genres.map(genre => genre._id),
          poster: res.data.poster
        });
        setInitialLoading(false);
      } catch (err) {
        setError('Failed to load movie data');
        setInitialLoading(false);
      }
    };

    fetchReferenceData();
    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formattedMovie = { ...movie };
      
      // Improve poster URL handling
      if (formattedMovie.poster) {
        // Remove any whitespace
        formattedMovie.poster = formattedMovie.poster.trim();
        
        // Check for IMDb mediaviewer URLs which won't work as direct image sources
        if (formattedMovie.poster.includes('imdb.com') && formattedMovie.poster.includes('mediaviewer')) {
          setError('IMDb viewer URLs cannot be used directly. Please find and use a direct link to the image file (.jpg, .png)');
          setLoading(false);
          return;
        }
        
        // If it's a relative path from TMDb, add the base URL
        if (formattedMovie.poster.startsWith('/')) {
          formattedMovie.poster = `https://image.tmdb.org/t/p/w500${formattedMovie.poster}`;
        }
        
        // If the URL starts with http but doesn't have a valid image extension,
        // verify it's a valid image URL or use a placeholder
        if (formattedMovie.poster.startsWith('http')) {
          // Ensure TMDb URLs have the correct format
          if (formattedMovie.poster.includes('image.tmdb.org/t/p') && !formattedMovie.poster.includes('/w')) {
            const path = formattedMovie.poster.split('image.tmdb.org/t/p')[1];
            formattedMovie.poster = `https://image.tmdb.org/t/p/w500${path}`;
          }
        }
      }

      if (id) {
        await axios.put(`/api/movies/${id}`, formattedMovie);
        setSuccess('Movie updated successfully');
      } else {
        await axios.post('/api/movies', formattedMovie);
        setSuccess('Movie created successfully');
      }
      
      setTimeout(() => {
        navigate('/movies');
      }, 1000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save movie';
      setError(message);
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          {id ? 'Edit Movie' : 'Add New Movie'}
        </Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          component={Link} 
          to="/movies"
        >
          Back to Movies
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              value={movie.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Release Year"
              name="releaseYear"
              type="number"
              fullWidth
              value={movie.releaseYear}
              onChange={handleChange}
              required
              inputProps={{ min: 1900, max: new Date().getFullYear() + 5 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Runtime (minutes)"
              name="runtime"
              type="number"
              fullWidth
              value={movie.runtime}
              onChange={handleChange}
              required
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Plot"
              name="plot"
              multiline
              rows={4}
              fullWidth
              value={movie.plot}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Poster URL"
              name="poster"
              fullWidth
              value={movie.poster}
              onChange={handleChange}
              helperText="Enter a valid image URL or leave blank for default"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="director-label">Director</InputLabel>
              <Select
                labelId="director-label"
                name="director"
                value={movie.director}
                onChange={handleChange}
                label="Director"
                required
              >
                {directors.map(director => (
                  <MenuItem key={director._id} value={director._id}>
                    {director.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="actors-label">Actors</InputLabel>
              <Select
                labelId="actors-label"
                multiple
                name="actors"
                value={movie.actors}
                onChange={handleChange}
                input={<OutlinedInput label="Actors" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const actor = actors.find(a => a._id === value);
                      return (
                        <Chip key={value} label={actor ? actor.name : value} />
                      );
                    })}
                  </Box>
                )}
              >
                {actors.map(actor => (
                  <MenuItem key={actor._id} value={actor._id}>
                    {actor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="genres-label">Genres</InputLabel>
              <Select
                labelId="genres-label"
                multiple
                name="genres"
                value={movie.genres}
                onChange={handleChange}
                input={<OutlinedInput label="Genres" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const genre = genres.find(g => g._id === value);
                      return (
                        <Chip key={value} label={genre ? genre.name : value} />
                      );
                    })}
                  </Box>
                )}
              >
                {genres.map(genre => (
                  <MenuItem key={genre._id} value={genre._id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : (id ? 'Update Movie' : 'Create Movie')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default MovieFormPage;
