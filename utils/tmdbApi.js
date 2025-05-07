const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Search for a movie by title
const searchMovieByTitle = async (title) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
      },
    });
    
    return response.data.results;
  } catch (error) {
    console.error('Error searching movie by title:', error.message);
    return [];
  }
};

// Fetch movie details by TMDB ID
const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ${movieId}:`, error.message);
    return null;
  }
};

// Extract director from movie credits
const extractDirector = (credits) => {
  if (!credits || !credits.crew) return null;
  return credits.crew.find(person => person.job === 'Director');
};

// Extract top cast members from movie credits
const extractCast = (credits, limit = 5) => {
  if (!credits || !credits.cast) return [];
  return credits.cast.slice(0, limit);
};

module.exports = {
  searchMovieByTitle,
  fetchMovieDetails,
  extractDirector,
  extractCast
}; 