// controllers/movieController.js
const asyncHandler = require('express-async-handler');
const Movie = require('../models/Movie');
const Director = require('../models/Director');
const Actor = require('../models/Actor');
const Genre = require('../models/Genre');
const tmdbApi = require('../utils/tmdbApi');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Private
const getMovies = asyncHandler(async (req, res) => {
  const pageSize = 16;
  const page = Number(req.query.page) || 1;
  
  // Allow filtering by title
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i', // case-insensitive
        },
      }
    : {};

  // Build filter object
  let filter = { ...keyword };

  // Filter by genres if provided
  if (req.query.genres) {
    // If genres are provided as a comma-separated string, split and convert to array
    const genreIds = req.query.genres.split(',');
    filter.genres = { $in: genreIds };
  }

  // Filter by director if provided
  if (req.query.director) {
    filter.director = req.query.director;
  }

  const count = await Movie.countDocuments(filter);
  const movies = await Movie.find(filter)
    .populate('director', 'name')
    .populate('actors', 'name')
    .populate('genres', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    movies,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get movie by ID
// @route   GET /api/movies/:id
// @access  Private
const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id)
    .populate('director', 'name birthYear bio image')
    .populate('actors', 'name birthYear bio image')
    .populate('genres', 'name description');

  if (movie) {
    res.json(movie);
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

// @desc    Get movie by ID with TMDB real-time data
// @route   GET /api/movies/:id/tmdb
// @access  Private
const getMovieWithTmdbData = asyncHandler(async (req, res) => {
  // First, get the movie from our database
  const movie = await Movie.findById(req.params.id)
    .populate('director', 'name birthYear bio image')
    .populate('actors', 'name birthYear bio image')
    .populate('genres', 'name description');

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  try {
    // Search for the movie in TMDB by title
    const searchResults = await tmdbApi.searchMovieByTitle(movie.title);
    
    if (searchResults.length === 0) {
      // Return original movie if no TMDB results found
      return res.json({ 
        ...movie.toObject(), 
        tmdbDataFound: false 
      });
    }

    // Find the best match by comparing release years
    const bestMatch = searchResults.find(result => 
      new Date(result.release_date).getFullYear() === movie.releaseYear
    ) || searchResults[0]; // fallback to first result if no year match

    // Get detailed TMDB data including credits
    const tmdbDetails = await tmdbApi.fetchMovieDetails(bestMatch.id);
    if (!tmdbDetails) {
      return res.json({ 
        ...movie.toObject(), 
        tmdbDataFound: false 
      });
    }

    // Extract director 
    const director = tmdbApi.extractDirector(tmdbDetails.credits);
    
    // Extract cast
    const cast = tmdbApi.extractCast(tmdbDetails.credits);
    
    // Format the response
    const enhancedMovie = {
      ...movie.toObject(),
      tmdbDataFound: true,
      tmdbId: tmdbDetails.id,
      realTimeData: {
        director: director ? {
          name: director.name,
          tmdbId: director.id,
          job: director.job
        } : null,
        cast: cast.map(actor => ({
          name: actor.name,
          character: actor.character,
          tmdbId: actor.id,
          profile_path: actor.profile_path
        })),
        poster_path: tmdbDetails.poster_path,
        backdrop_path: tmdbDetails.backdrop_path,
        vote_average: tmdbDetails.vote_average,
        vote_count: tmdbDetails.vote_count
      }
    };

    res.json(enhancedMovie);
  } catch (error) {
    console.error('Error fetching TMDB data:', error);
    // Return original movie if there's an error with TMDB
    res.json({ 
      ...movie.toObject(), 
      tmdbDataFound: false,
      error: 'Failed to fetch real-time data from TMDB' 
    });
  }
});

// @desc    Create a movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = asyncHandler(async (req, res) => {
  const { title, releaseYear, plot, runtime, director, actors, genres, poster } = req.body;

  const movie = await Movie.create({
    title,
    releaseYear,
    plot,
    runtime,
    director,
    actors,
    genres,
    poster,
  });

  // Update the director's movies array
  await Director.findByIdAndUpdate(director, {
    $push: { movies: movie._id },
  });

  // Update the actors' movies array
  await Actor.updateMany(
    { _id: { $in: actors } },
    { $push: { movies: movie._id } }
  );

  // Update the genres' movies array
  await Genre.updateMany(
    { _id: { $in: genres } },
    { $push: { movies: movie._id } }
  );

  if (movie) {
    res.status(201).json(movie);
  } else {
    res.status(400);
    throw new Error('Invalid movie data');
  }
});

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = asyncHandler(async (req, res) => {
  const { title, releaseYear, plot, runtime, director, actors, genres, poster } = req.body;

  const movie = await Movie.findById(req.params.id);

  if (movie) {
    // If director is changed, update both old and new director's movies array
    if (director && movie.director.toString() !== director) {
      // Remove movie from old director's movies array
      await Director.findByIdAndUpdate(movie.director, {
        $pull: { movies: movie._id },
      });

      // Add movie to new director's movies array
      await Director.findByIdAndUpdate(director, {
        $push: { movies: movie._id },
      });
    }

    // Update movie
    movie.title = title || movie.title;
    movie.releaseYear = releaseYear || movie.releaseYear;
    movie.plot = plot || movie.plot;
    movie.runtime = runtime || movie.runtime;
    movie.director = director || movie.director;
    movie.actors = actors || movie.actors;
    movie.genres = genres || movie.genres;
    movie.poster = poster || movie.poster;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = asyncHandler(async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }

    // Remove movie from director's movies array
    if (movie.director) {
      await Director.findByIdAndUpdate(movie.director, {
        $pull: { movies: movie._id },
      });
    }

    // Remove movie from actors' movies array
    if (movie.actors && movie.actors.length > 0) {
      await Actor.updateMany(
        { _id: { $in: movie.actors } },
        { $pull: { movies: movie._id } }
      );
    }

    // Remove movie from genres' movies array
    if (movie.genres && movie.genres.length > 0) {
      await Genre.updateMany(
        { _id: { $in: movie.genres } },
        { $pull: { movies: movie._id } }
      );
    }

    // Use deleteOne() instead of remove()
    await movie.deleteOne();
    
    res.status(200).json({ message: 'Movie removed' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500);
    throw new Error('Failed to delete movie: ' + error.message);
  }
});

module.exports = {
  getMovies,
  getMovieById,
  getMovieWithTmdbData,
  createMovie,
  updateMovie,
  deleteMovie,
};