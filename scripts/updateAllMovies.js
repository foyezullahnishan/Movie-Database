const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Model imports
const Movie = require('../models/Movie');
const Director = require('../models/Director');
const Actor = require('../models/Actor');
const Genre = require('../models/Genre');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Map of directors with their details
const directorsMap = {
  'Christopher Nolan': {
    birthYear: 1970,
    bio: 'Christopher Nolan is a British-American film director known for his cerebral, often nonlinear, storytelling.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Christopher_Nolan_Cannes_2018.jpg'
  },
  'Steven Spielberg': {
    birthYear: 1946,
    bio: 'Steven Spielberg is an American director, producer, and screenwriter. He is considered one of the founding pioneers of the New Hollywood era.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Steven_Spielberg_by_Gage_Skidmore.jpg'
  },
  'Quentin Tarantino': {
    birthYear: 1963,
    bio: 'Quentin Tarantino is an American film director, screenwriter, producer, and actor known for his nonlinear storylines and stylized violence.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Quentin_Tarantino_by_Gage_Skidmore.jpg'
  },
  'Martin Scorsese': {
    birthYear: 1942,
    bio: 'Martin Scorsese is an American film director, producer, screenwriter, and actor known for his work addressing themes like Italian-American identity and Roman Catholic concepts of guilt and redemption.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Martin_Scorsese_Berlinale_2010_%28cropped%29.jpg'
  },
  'James Cameron': {
    birthYear: 1954,
    bio: 'James Cameron is a Canadian filmmaker known for directing big-budget, high-concept science fiction films.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/James_Cameron_by_Gage_Skidmore.jpg'
  },
  'Frank Darabont': {
    birthYear: 1959,
    bio: 'Frank Darabont is a Hungarian-American filmmaker and screenwriter known for his film adaptations of Stephen King novels.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Frank_Darabont_at_the_PaleyFest_2011_-_The_Walking_Dead_panel.jpg'
  },
  'Bong Joon-ho': {
    birthYear: 1969,
    bio: 'Bong Joon-ho is a South Korean film director, producer and screenwriter. His films feature social themes, genre-mixing, black humor, and sudden tone shifts.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Bong_Joon-ho%2C_2019.jpg/330px-Bong_Joon-ho%2C_2019.jpg'
  },
  'Peter Jackson': {
    birthYear: 1961,
    bio: 'Sir Peter Jackson is a New Zealand film director, producer, and screenwriter, best known for his The Lord of the Rings trilogy and The Hobbit trilogy.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Peter_Jackson_SDCC_2014.jpg'
  },
  'George Lucas': {
    birthYear: 1944,
    bio: 'George Lucas is an American filmmaker and entrepreneur, best known for creating the Star Wars and Indiana Jones franchises.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/George_Lucas_cropped_2009.jpg'
  },
  'Francis Ford Coppola': {
    birthYear: 1939,
    bio: 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is considered one of the major figures of the New Hollywood filmmaking movement of the 1960s and 1970s.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Francis_Ford_Coppola_Cannes_2019_2.jpg'
  },
  'Jonathan Demme': {
    birthYear: 1944,
    bio: 'Jonathan Demme was an American director, producer, and screenwriter known for his critically acclaimed films such as The Silence of the Lambs.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Jonathan_Demme_2015.jpg'
  },
  'Ridley Scott': {
    birthYear: 1937,
    bio: 'Sir Ridley Scott is an English film director and producer known for his work on science fiction films.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Ridley_Scott_by_Gage_Skidmore.jpg'
  },
  'Robert Zemeckis': {
    birthYear: 1952,
    bio: 'Robert Zemeckis is an American filmmaker known for directing blockbuster films like Back to the Future and Forrest Gump.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Robert_Zemeckis_%22The_Walk%22_at_Opening_Ceremony_of_the_28th_Tokyo_International_Film_Festival_%2822453236392%29_%28cropped%29.jpg'
  },
  'Denis Villeneuve': {
    birthYear: 1967,
    bio: 'Denis Villeneuve is a Canadian film director and screenwriter known for his technically complex and visually striking films.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Denis_Villeneuve_by_Gage_Skidmore_%28cropped%29.jpg'
  },
  'Stanley Kubrick': {
    birthYear: 1928,
    bio: 'Stanley Kubrick was an American film director, screenwriter, and producer. He is frequently cited as one of the most influential filmmakers in cinematic history.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Kubrick_on_the_set_of_Barry_Lyndon_%281975_publicity_photo%29_crop.jpg'
  },
  'Todd Phillips': {
    birthYear: 1970,
    bio: 'Todd Phillips is an American filmmaker and actor known for directing The Hangover, Joker, and other comedies and dramas.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Todd_Phillips_%2848484625291%29_%28cropped%29.jpg'
  },
  'The Russo Brothers': {
    birthYear: 1971, // Anthony Russo's birth year
    bio: 'Anthony and Joseph Russo, commonly known as the Russo brothers, are American directors, producers, and screenwriters known for their work in the Marvel Cinematic Universe.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Russos_%26_Markus_Cropped.jpg'
  },
  'Peter Weir': {
    birthYear: 1944,
    bio: 'Peter Weir is an Australian film director known for both Australian New Wave cinema and American studio productions.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Peter_Weir_Deauville_2022.jpg'
  },
  'Roger Allers': {
    birthYear: 1949,
    bio: 'Roger Allers is an American film director, screenwriter, storyboard artist, and playwright best known for co-directing The Lion King.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/The_Lion_Guard_Return_of_the_Roar_Interview.jpg'
  },
  'Damien Chazelle': {
    birthYear: 1985,
    bio: 'Damien Chazelle is an American filmmaker known for his musical drama films Whiplash and La La Land.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Damien_Chazelle_2018.jpg'
  },
  'Bob Persichetti': {
    birthYear: 1973,
    bio: 'Bob Persichetti is an American film director, screenwriter, and animator known for co-directing Spider-Man: Into the Spider-Verse.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Bob_Persichetti%2C_Peter_Ramsey_and_Rodney_Rothman_%2846894700835%29_%28cropped%29.jpg'
  }
};

// Define proper movie metadata
const movieMetadata = [
  {
    title: 'Inception',
    director: 'Christopher Nolan',
    actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy'],
    genres: ['Action', 'Science Fiction', 'Thriller']
  },
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    genres: ['Drama']
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    actors: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    genres: ['Drama', 'Crime']
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    actors: ['John Travolta', 'Samuel L. Jackson', 'Uma Thurman', 'Bruce Willis'],
    genres: ['Crime', 'Drama']
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    genres: ['Action', 'Crime', 'Drama']
  },
  {
    title: 'Interstellar',
    director: 'Christopher Nolan',
    actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    genres: ['Science Fiction', 'Adventure', 'Drama']
  },
  {
    title: 'Jurassic Park',
    director: 'Steven Spielberg',
    actors: ['Sam Neill', 'Laura Dern', 'Jeff Goldblum', 'Richard Attenborough'],
    genres: ['Adventure', 'Science Fiction']
  },
  {
    title: 'The Departed',
    director: 'Martin Scorsese',
    actors: ['Leonardo DiCaprio', 'Matt Damon', 'Jack Nicholson', 'Mark Wahlberg'],
    genres: ['Crime', 'Drama', 'Thriller']
  },
  {
    title: 'E.T. the Extra-Terrestrial',
    director: 'Steven Spielberg',
    actors: ['Henry Thomas', 'Drew Barrymore', 'Dee Wallace'],
    genres: ['Science Fiction', 'Adventure', 'Family']
  },
  {
    title: 'Goodfellas',
    director: 'Martin Scorsese',
    actors: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci'],
    genres: ['Crime', 'Drama']
  },
  {
    title: 'Kill Bill: Vol. 1',
    director: 'Quentin Tarantino',
    actors: ['Uma Thurman', 'David Carradine', 'Lucy Liu'],
    genres: ['Action', 'Crime', 'Thriller']
  },
  {
    title: 'The Matrix',
    director: 'The Wachowskis',
    actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss', 'Hugo Weaving'],
    genres: ['Action', 'Science Fiction']
  },
  {
    title: 'Forrest Gump',
    director: 'Robert Zemeckis',
    actors: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
    genres: ['Drama', 'Romance']
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    director: 'Peter Jackson',
    actors: ['Elijah Wood', 'Ian McKellen', 'Viggo Mortensen', 'Orlando Bloom'],
    genres: ['Adventure', 'Fantasy']
  },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    director: 'George Lucas',
    actors: ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher', 'Alec Guinness'],
    genres: ['Action', 'Adventure', 'Fantasy', 'Science Fiction']
  },
  {
    title: 'Titanic',
    director: 'James Cameron',
    actors: ['Leonardo DiCaprio', 'Kate Winslet', 'Billy Zane'],
    genres: ['Drama', 'Romance']
  },
  {
    title: 'The Silence of the Lambs',
    director: 'Jonathan Demme',
    actors: ['Jodie Foster', 'Anthony Hopkins', 'Scott Glenn'],
    genres: ['Crime', 'Drama', 'Thriller']
  },
  {
    title: 'The Green Mile',
    director: 'Frank Darabont',
    actors: ['Tom Hanks', 'Michael Clarke Duncan', 'David Morse'],
    genres: ['Crime', 'Drama', 'Fantasy']
  },
  {
    title: 'The Godfather: Part II',
    director: 'Francis Ford Coppola',
    actors: ['Al Pacino', 'Robert De Niro', 'Robert Duvall'],
    genres: ['Crime', 'Drama']
  },
  {
    title: 'Schindler\'s List',
    director: 'Steven Spielberg',
    actors: ['Liam Neeson', 'Ben Kingsley', 'Ralph Fiennes'],
    genres: ['Biography', 'Drama', 'History']
  },
  {
    title: 'Gladiator',
    director: 'Ridley Scott',
    actors: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen'],
    genres: ['Action', 'Adventure', 'Drama']
  },
  {
    title: 'The Lion King',
    director: 'Roger Allers',
    actors: ['Matthew Broderick', 'James Earl Jones', 'Jeremy Irons'],
    genres: ['Animation', 'Adventure', 'Drama']
  },
  {
    title: 'Parasite',
    director: 'Bong Joon-ho',
    actors: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
    genres: ['Drama', 'Thriller']
  },
  {
    title: 'Whiplash',
    director: 'Damien Chazelle',
    actors: ['Miles Teller', 'J.K. Simmons', 'Melissa Benoist'],
    genres: ['Drama', 'Music']
  },
  {
    title: 'Joker',
    director: 'Todd Phillips',
    actors: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz'],
    genres: ['Crime', 'Drama', 'Thriller']
  },
  {
    title: 'Avengers: Endgame',
    director: 'The Russo Brothers',
    actors: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth'],
    genres: ['Action', 'Adventure', 'Fantasy']
  },
  {
    title: 'The Truman Show',
    director: 'Peter Weir',
    actors: ['Jim Carrey', 'Laura Linney', 'Ed Harris'],
    genres: ['Comedy', 'Drama']
  },
  {
    title: 'Avatar',
    director: 'James Cameron',
    actors: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    genres: ['Action', 'Adventure', 'Science Fiction']
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    director: 'Bob Persichetti',
    actors: ['Shameik Moore', 'Jake Johnson', 'Hailee Steinfeld'],
    genres: ['Animation', 'Action', 'Adventure']
  },
  {
    title: 'The Shining',
    director: 'Stanley Kubrick',
    actors: ['Jack Nicholson', 'Shelley Duvall', 'Danny Lloyd'],
    genres: ['Drama', 'Horror']
  },
  {
    title: 'Blade Runner 2049',
    director: 'Denis Villeneuve',
    actors: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas'],
    genres: ['Action', 'Drama', 'Science Fiction']
  },
  {
    title: 'Dune',
    director: 'Denis Villeneuve',
    actors: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac', 'Zendaya'],
    genres: ['Adventure', 'Drama', 'Science Fiction']
  }
];

// Helper to find or create an actor
async function findOrCreateActor(name) {
  let actor = await Actor.findOne({ name });
  
  // If actor doesn't exist, create a placeholder
  if (!actor) {
    console.log(`Creating new actor: ${name}`);
    actor = await Actor.create({
      name,
      birthYear: null,
      bio: `${name} is a renowned actor known for their versatile performances in film and television.`,
      image: null
    });
  }
  
  return actor;
}

// Helper to find or create a genre
async function findOrCreateGenre(name) {
  let genre = await Genre.findOne({ name });
  
  // If genre doesn't exist, create it
  if (!genre) {
    console.log(`Creating new genre: ${name}`);
    genre = await Genre.create({
      name,
      description: `${name} films`
    });
  }
  
  return genre;
}

// Helper to find or create a director
async function findOrCreateDirector(name) {
  let director = await Director.findOne({ name });
  
  // If director doesn't exist, create it with metadata if available
  if (!director) {
    const directorData = directorsMap[name] || {
      birthYear: null,
      bio: `${name} is a distinguished filmmaker known for their contribution to cinema.`,
      image: null
    };
    
    console.log(`Creating new director: ${name}`);
    director = await Director.create({
      name,
      birthYear: directorData.birthYear,
      bio: directorData.bio,
      image: directorData.image
    });
  }
  
  return director;
}

// Main function to update all movies
async function updateAllMovies() {
  try {
    console.log('Connecting to MongoDB...');
    
    // Process each movie
    for (const metadata of movieMetadata) {
      const { title, director: directorName, actors: actorNames, genres: genreNames } = metadata;
      
      // Find the movie
      const movie = await Movie.findOne({ title });
      
      if (!movie) {
        console.log(`Movie "${title}" not found, skipping...`);
        continue;
      }
      
      console.log(`Processing movie: ${title}`);
      
      // Find or create director
      const director = await findOrCreateDirector(directorName);
      
      // Find or create actors
      const actorPromises = actorNames.map(name => findOrCreateActor(name));
      const actors = await Promise.all(actorPromises);
      
      // Find or create genres
      const genrePromises = genreNames.map(name => findOrCreateGenre(name));
      const genres = await Promise.all(genrePromises);
      
      // Get old references to remove them later
      const oldDirectorId = movie.director;
      const oldActorIds = [...movie.actors];
      const oldGenreIds = [...movie.genres];
      
      // Update the movie
      movie.director = director._id;
      movie.actors = actors.map(actor => actor._id);
      movie.genres = genres.map(genre => genre._id);
      
      await movie.save();
      console.log(`Updated ${title} with correct director and cast`);
      
      // Clean up old references
      if (oldDirectorId) {
        await Director.findByIdAndUpdate(oldDirectorId, {
          $pull: { movies: movie._id }
        });
      }
      
      for (const actorId of oldActorIds) {
        await Actor.findByIdAndUpdate(actorId, {
          $pull: { movies: movie._id }
        });
      }
      
      for (const genreId of oldGenreIds) {
        await Genre.findByIdAndUpdate(genreId, {
          $pull: { movies: movie._id }
        });
      }
      
      // Add new references
      await Director.findByIdAndUpdate(director._id, {
        $addToSet: { movies: movie._id }
      });
      
      for (const actor of actors) {
        await Actor.findByIdAndUpdate(actor._id, {
          $addToSet: { movies: movie._id }
        });
      }
      
      for (const genre of genres) {
        await Genre.findByIdAndUpdate(genre._id, {
          $addToSet: { movies: movie._id }
        });
      }
    }
    
    console.log('All movies have been updated with correct data!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the update
updateAllMovies(); 