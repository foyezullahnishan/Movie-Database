import axios from 'axios';

// Set axios default baseURL for API calls 
axios.defaults.baseURL = 'http://localhost:5001';

// Movies API
export const moviesApi = {
  // Get all movies with pagination
  getAll: async (page = 1) => {
    try {
      const res = await axios.get(`/api/movies?page=${page}`);
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get movie by ID
  getById: async (id) => {
    try {
      const res = await axios.get(`/api/movies/${id}`);
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get movie by ID with real-time TMDB data
  getWithTmdbData: async (id) => {
    try {
      const res = await axios.get(`/api/movies/${id}/tmdb`);
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Create a new movie
  create: async (movieData) => {
    try {
      const res = await axios.post('/api/movies', movieData);
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Update a movie
  update: async (id, movieData) => {
    try {
      const res = await axios.put(`/api/movies/${id}`, movieData);
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Delete a movie
  delete: async (id) => {
    try {
      await axios.delete(`/api/movies/${id}`);
      return true;
    } catch (error) {
      throw handleError(error);
    }
  }
};

// Directors API
export const directorsApi = {
  // Get all directors
  getAll: async () => {
    try {
      const res = await axios.get('/api/directors');
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get director by ID
  getById: async (id) => {
    try {
      const res = await axios.get(`/api/directors/${id}`);
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  }
};

// Actors API
export const actorsApi = {
  // Get all actors
  getAll: async () => {
    try {
      const res = await axios.get('/api/actors');
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get actor by ID
  getById: async (id) => {
    try {
      const res = await axios.get(`/api/actors/${id}`);
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  }
};

// Genres API
export const genresApi = {
  // Get all genres
  getAll: async () => {
    try {
      const res = await axios.get('/api/genres');
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get genre by ID
  getById: async (id) => {
    try {
      const res = await axios.get(`/api/genres/${id}`);
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  }
};

// Authentication API
export const authApi = {
  // Register a new user
  register: async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Login a user
  login: async (credentials) => {
    try {
      const res = await axios.post('/api/auth/login', credentials);
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      return res.data;
    } catch (error) {
      throw handleError(error);
    }
  }
};

// Helper function to handle errors
const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorMessage = error.response.data.message || 'Server error';
    return new Error(errorMessage);
  } else if (error.request) {
    // The request was made but no response was received
    return new Error('No response from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    return new Error('Error setting up request: ' + error.message);
  }
}; 