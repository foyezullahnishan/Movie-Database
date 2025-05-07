const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const Director = require('./models/Director');
const Actor = require('./models/Actor');
const Genre = require('./models/Genre');

// Load environment variables
dotenv.config();

// Sample data
const genres = [
  { name: 'Action', description: 'Action-packed excitement and adventure' },
  { name: 'Drama', description: 'Character development and emotional themes' },
  { name: 'Science Fiction', description: 'Futuristic concepts and technology' },
  { name: 'Comedy', description: 'Humor and entertainment' },
  { name: 'Thriller', description: 'Suspense and excitement' },
  { name: 'Horror', description: 'Fear and the supernatural' },
  { name: 'Romance', description: 'Love and relationships' },
  { name: 'Fantasy', description: 'Magic and supernatural phenomena' }
];

const directors = [
  { name: 'Christopher Nolan', birthYear: 1970, bio: 'British-American filmmaker known for his nonlinear storytelling and innovative practical effects.' },
  { name: 'Steven Spielberg', birthYear: 1946, bio: 'American filmmaker and one of the founding pioneers of the New Hollywood era.' },
  { name: 'Martin Scorsese', birthYear: 1942, bio: 'American-Italian filmmaker known for his work addressing themes like Italian-American identity and Catholic concepts.' },
  { name: 'Quentin Tarantino', birthYear: 1963, bio: 'American filmmaker known for nonlinear storylines, dark humor, and stylized violence.' },
  { name: 'Denis Villeneuve', birthYear: 1967, bio: 'Canadian filmmaker known for his artistic, visually-driven style and emotional storytelling.' }
];

const actors = [
  { name: 'Leonardo DiCaprio', birthYear: 1974, bio: 'American actor known for his work in biopics and with acclaimed directors.' },
  { name: 'Tom Hanks', birthYear: 1956, bio: 'American actor and filmmaker, known for both comedic and dramatic roles.' },
  { name: 'Meryl Streep', birthYear: 1949, bio: 'American actress often described as the best actress of her generation.' },
  { name: 'Brad Pitt', birthYear: 1963, bio: 'American actor and film producer, recipient of multiple accolades.' },
  { name: 'Jennifer Lawrence', birthYear: 1990, bio: 'American actress known for action films and independent dramas.' },
  { name: 'Denzel Washington', birthYear: 1954, bio: 'American actor, director, and producer known for powerful performances.' },
  { name: 'Robert De Niro', birthYear: 1943, bio: 'American actor, producer, and director known for his collaborations with Martin Scorsese.' },
  { name: 'Scarlett Johansson', birthYear: 1984, bio: 'American actress and singer, highest-grossing box office star of all time.' },
  { name: 'Morgan Freeman', birthYear: 1937, bio: 'American actor, director, and narrator known for his distinctive voice.' },
  { name: 'Christian Bale', birthYear: 1974, bio: 'English actor known for his versatility and intense method acting.' }
];

const movies = [
  {
    title: 'Inception',
    releaseYear: 2010,
    plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    runtime: 148,
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    directorIndex: 0, // Christopher Nolan
    actorIndices: [0, 9], // Leonardo DiCaprio, Christian Bale
    genreIndices: [0, 2, 4] // Action, Science Fiction, Thriller
  },
  {
    title: 'The Shawshank Redemption',
    releaseYear: 1994,
    plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    runtime: 142,
    poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    directorIndex: 2, // Martin Scorsese (not accurate but for example)
    actorIndices: [8], // Morgan Freeman
    genreIndices: [1] // Drama
  },
  {
    title: 'Interstellar',
    releaseYear: 2014,
    plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    runtime: 169,
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    directorIndex: 0, // Christopher Nolan
    actorIndices: [3], // Brad Pitt (not accurate but for example)
    genreIndices: [0, 2, 1] // Action, Science Fiction, Drama
  },
  {
    title: 'The Dark Knight',
    releaseYear: 2008,
    plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    runtime: 152,
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    directorIndex: 0, // Christopher Nolan
    actorIndices: [9], // Christian Bale
    genreIndices: [0, 4] // Action, Thriller
  },
  {
    title: 'Pulp Fiction',
    releaseYear: 1994,
    plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    runtime: 154,
    poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    directorIndex: 3, // Quentin Tarantino
    actorIndices: [3, 5], // Brad Pitt, Denzel Washington (not accurate but for example)
    genreIndices: [1, 4] // Drama, Thriller
  },
  {
    title: 'Dune',
    releaseYear: 2021,
    plot: 'Feature adaptation of Frank Herbert\'s science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
    runtime: 155,
    poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    directorIndex: 4, // Denis Villeneuve
    actorIndices: [4], // Jennifer Lawrence (not accurate but for example)
    genreIndices: [0, 2, 7] // Action, Science Fiction, Fantasy
  }
];

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

// Clear database and import sample data
const importData = async () => {
  try {
    await connectDB();

    // Clear previous data
    await Movie.deleteMany();
    await Director.deleteMany();
    await Actor.deleteMany();
    await Genre.deleteMany();

    console.log('Previous data cleared...');

    // Create genres
    const createdGenres = await Genre.insertMany(genres);
    console.log(`${createdGenres.length} genres created`);

    // Create directors
    const createdDirectors = await Director.insertMany(directors);
    console.log(`${createdDirectors.length} directors created`);

    // Create actors
    const createdActors = await Actor.insertMany(actors);
    console.log(`${createdActors.length} actors created`);

    // Create movies with references to directors, actors, and genres
    for (const movie of movies) {
      const directorId = createdDirectors[movie.directorIndex]._id;
      const actorIds = movie.actorIndices.map(index => createdActors[index]._id);
      const genreIds = movie.genreIndices.map(index => createdGenres[index]._id);

      const createdMovie = await Movie.create({
        title: movie.title,
        releaseYear: movie.releaseYear,
        plot: movie.plot,
        runtime: movie.runtime,
        director: directorId,
        actors: actorIds,
        genres: genreIds,
        poster: movie.poster
      });

      // Update director with movie reference
      await Director.findByIdAndUpdate(directorId, {
        $push: { movies: createdMovie._id }
      });

      // Update actors with movie reference
      await Actor.updateMany(
        { _id: { $in: actorIds } },
        { $push: { movies: createdMovie._id } }
      );

      // Update genres with movie reference
      await Genre.updateMany(
        { _id: { $in: genreIds } },
        { $push: { movies: createdMovie._id } }
      );

      console.log(`Created movie: ${movie.title}`);
    }

    console.log('Data Import Completed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the import
importData(); 