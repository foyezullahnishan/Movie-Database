// scripts/tmdbUpdater.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../models/Movie');
const Director = require('../models/Director');
const Actor = require('../models/Actor');
const tmdbApi = require('../utils/tmdbApi');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Update a movie with TMDB data
const updateMovieWithTmdbData = async (movie) => {
  try {
    console.log(`Updating movie: ${movie.title} (${movie.releaseYear})`);
    
    // Search for the movie in TMDB
    const results = await tmdbApi.searchMovieByTitle(movie.title);
    if (results.length === 0) {
      console.log(`No TMDB results found for: ${movie.title}`);
      return false;
    }
    
    // Find best match by comparing release years
    const bestMatch = results.find(
      result => new Date(result.release_date).getFullYear() === movie.releaseYear
    ) || results[0];
    
    console.log(`Best TMDB match: ${bestMatch.title} (${bestMatch.release_date.slice(0, 4)})`);
    
    // Get detailed movie info from TMDB
    const tmdbDetails = await tmdbApi.fetchMovieDetails(bestMatch.id);
    if (!tmdbDetails) {
      console.log(`Failed to fetch TMDB details for: ${movie.title}`);
      return false;
    }
    
    // Extract director info
    const directorData = tmdbApi.extractDirector(tmdbDetails.credits);
    if (!directorData) {
      console.log(`No director found for: ${movie.title}`);
      return false;
    }
    
    // Find or create director
    let director = await Director.findOne({ name: directorData.name });
    if (!director) {
      director = await Director.create({
        name: directorData.name,
        birthYear: null, // We would need another API call to get this data
        bio: `Director known for their work on ${movie.title}.`,
        movies: [movie._id]
      });
    } else if (!director.movies.includes(movie._id)) {
      director.movies.push(movie._id);
      await director.save();
    }
    
    // Extract top cast members
    const castData = tmdbApi.extractCast(tmdbDetails.credits);
    const actorIds = [];
    
    // Create or update actors
    for (const actorInfo of castData) {
      let actor = await Actor.findOne({ name: actorInfo.name });
      
      if (!actor) {
        actor = await Actor.create({
          name: actorInfo.name,
          birthYear: null, // Would need another API call
          bio: `Actor known for playing ${actorInfo.character} in ${movie.title}.`,
          movies: [movie._id]
        });
      } else if (!actor.movies.includes(movie._id)) {
        actor.movies.push(movie._id);
        await actor.save();
      }
      
      actorIds.push(actor._id);
    }
    
    // Update the movie with TMDB data
    movie.director = director._id;
    movie.actors = actorIds;
    movie.plot = tmdbDetails.overview || movie.plot;
    movie.runtime = tmdbDetails.runtime || movie.runtime;
    movie.poster = tmdbDetails.poster_path 
      ? `https://image.tmdb.org/t/p/w500${tmdbDetails.poster_path}` 
      : movie.poster;
    
    await movie.save();
    console.log(`Successfully updated: ${movie.title}`);
    return true;
  } catch (error) {
    console.error(`Error updating movie ${movie.title}:`, error.message);
    return false;
  }
};

// Update all movies in the database
const updateAllMovies = async () => {
  try {
    await connectDB();
    
    // Get all movies
    const movies = await Movie.find({});
    console.log(`Found ${movies.length} movies to update`);
    
    let updatedCount = 0;
    let failedCount = 0;
    
    // Update each movie
    for (const movie of movies) {
      const success = await updateMovieWithTmdbData(movie);
      if (success) {
        updatedCount++;
      } else {
        failedCount++;
      }
      
      // Add a delay to avoid hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`
      Update completed!
      Successfully updated: ${updatedCount} movies
      Failed to update: ${failedCount} movies
    `);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating movies:', error.message);
    process.exit(1);
  }
};

// Run the updater
updateAllMovies(); 