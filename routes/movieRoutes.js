// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  getMovieWithTmdbData,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');
const validateMovie = require('../middleware/validateMovie');

router.route('/')
  .get(protect, getMovies)
  .post(protect, admin, validateMovie, createMovie);

// Route for getting movie with real-time TMDB data
router.route('/:id/tmdb')
  .get(protect, getMovieWithTmdbData);

router.route('/:id')
  .get(protect, getMovieById)
  .put(protect, admin, validateMovie, updateMovie)
  .delete(protect, admin, deleteMovie);

module.exports = router;