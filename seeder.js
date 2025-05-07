const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');

// Model imports
const Movie = require('./models/Movie');
const Director = require('./models/Director');
const Actor = require('./models/Actor');
const Genre = require('./models/Genre');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Sample data
const genres = [
  { name: 'Action' },
  { name: 'Comedy' },
  { name: 'Drama' },
  { name: 'Horror' },
  { name: 'Science Fiction' },
  { name: 'Thriller' },
  { name: 'Romance' },
  { name: 'Adventure' },
  { name: 'Fantasy' },
  { name: 'Mystery' }
];

const directors = [
  {
    name: 'Christopher Nolan',
    birthYear: 1970,
    bio: 'Christopher Nolan is a British-American film director known for his cerebral, often nonlinear, storytelling.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Christopher_Nolan_Cannes_2018.jpg'
  },
  {
    name: 'Steven Spielberg',
    birthYear: 1946,
    bio: 'Steven Spielberg is an American director, producer, and screenwriter. He is considered one of the founding pioneers of the New Hollywood era.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Steven_Spielberg_by_Gage_Skidmore.jpg'
  },
  {
    name: 'Quentin Tarantino',
    birthYear: 1963,
    bio: 'Quentin Tarantino is an American film director, screenwriter, producer, and actor known for his nonlinear storylines and stylized violence.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Quentin_Tarantino_by_Gage_Skidmore.jpg'
  },
  {
    name: 'Martin Scorsese',
    birthYear: 1942,
    bio: 'Martin Scorsese is an American film director, producer, screenwriter, and actor known for his work addressing themes like Italian-American identity and Roman Catholic concepts of guilt and redemption.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Martin_Scorsese_Berlinale_2010_%28cropped%29.jpg'
  },
  {
    name: 'Denis Villeneuve',
    birthYear: 1967,
    bio: 'Denis Villeneuve is a Canadian film director, producer, and screenwriter known for his technically complex and visually striking films.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Denis_Villeneuve_by_Gage_Skidmore_%28cropped%29.jpg'
  }
];

const actors = [
  {
    name: 'Leonardo DiCaprio',
    birthYear: 1974,
    bio: 'Leonardo DiCaprio is an American actor and film producer known for his intense, unconventional roles in biopics and period pieces.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Leonardo_Dicaprio_Cannes_2019.jpg'
  },
  {
    name: 'Meryl Streep',
    birthYear: 1949,
    bio: 'Meryl Streep is an American actress often described as the "best actress of her generation". She is known for her versatility and accent adaptation.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Meryl_Streep_December_2018.jpg'
  },
  {
    name: 'Tom Hanks',
    birthYear: 1956,
    bio: 'Tom Hanks is an American actor and filmmaker known for both comedic and dramatic roles and is one of the most popular and recognizable film stars worldwide.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Tom_Hanks_TIFF_2019.jpg'
  },
  {
    name: 'Viola Davis',
    birthYear: 1965,
    bio: 'Viola Davis is an American actress and producer. She is known for her strong character portrayals in various film, television and theater productions.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Viola_Davis_by_Gage_Skidmore.jpg'
  },
  {
    name: 'Denzel Washington',
    birthYear: 1954,
    bio: 'Denzel Washington is an American actor, director, and producer. He has been described as an actor who reconfigured "the concept of classic movie stardom".',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Denzel_Washington_cropped_2010.jpg'
  },
  {
    name: 'Jennifer Lawrence',
    birthYear: 1990,
    bio: 'Jennifer Lawrence is an American actress. Her films have grossed over $6 billion worldwide, and she was the highest-paid actress in the world in 2015 and 2016.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Jennifer_Lawrence_SDCC_2015_X-Men.jpg'
  },
  {
    name: 'Brad Pitt',
    birthYear: 1963,
    bio: 'Brad Pitt is an American actor and film producer. He has received multiple awards and nominations.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg'
  },
  {
    name: 'Scarlett Johansson',
    birthYear: 1984,
    bio: 'Scarlett Johansson is an American actress and singer. She is the world\'s highest-paid actress since 2018 and has made multiple appearances in the Forbes Celebrity 100.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Scarlett_Johansson_by_Gage_Skidmore_2019.jpg'
  }
];

const movies = [
  {
    title: 'Inception',
    plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    releaseYear: 2010,
    runtime: 148,
    poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg'
  },
  {
    title: 'The Shawshank Redemption',
    plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    releaseYear: 1994,
    runtime: 142,
    poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg'
  },
  {
    title: 'The Godfather',
    plot: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    releaseYear: 1972,
    runtime: 175,
    poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
  },
  {
    title: 'Pulp Fiction',
    plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    releaseYear: 1994,
    runtime: 154,
    poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
  },
  {
    title: 'The Dark Knight',
    plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    releaseYear: 2008,
    runtime: 152,
    poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg'
  },
  {
    title: 'Dune',
    plot: 'Feature adaptation of Frank Herbert\'s science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
    releaseYear: 2021,
    runtime: 155,
    poster: 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg'
  },
  {
    title: 'Interstellar',
    plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    releaseYear: 2014,
    runtime: 169,
    poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg'
  },
  {
    title: 'Jurassic Park',
    plot: 'A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park\'s cloned dinosaurs to run loose.',
    releaseYear: 1993,
    runtime: 127,
    poster: 'https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_.jpg'
  },
  {
    title: 'The Departed',
    plot: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.',
    releaseYear: 2006,
    runtime: 151,
    poster: 'https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_.jpg'
  },
  {
    title: 'E.T. the Extra-Terrestrial',
    plot: 'A troubled child summons the courage to help a friendly alien escape Earth and return to his home world.',
    releaseYear: 1982,
    runtime: 115,
    poster: 'https://m.media-amazon.com/images/M/MV5BMTQ2ODFlMDAtNzdhOC00ZDYzLWE3YTMtNDU4ZGFmZmJmYTczXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg'
  },
  {
    title: 'Goodfellas',
    plot: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.',
    releaseYear: 1990,
    runtime: 146,
    poster: 'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
  },
  {
    title: 'Kill Bill: Vol. 1',
    plot: 'After awakening from a four-year coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.',
    releaseYear: 2003,
    runtime: 111,
    poster: 'https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTAtYmU5Mi00NGRmLTljYjgtMDkyODQ4MjNkMGY2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
  }
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await Movie.deleteMany();
    await Director.deleteMany();
    await Actor.deleteMany();
    await Genre.deleteMany();

    console.log('Data cleared from database...'.red.inverse);

    // Insert genre data
    const createdGenres = await Genre.insertMany(genres);
    console.log(`${createdGenres.length} genres added`.green.inverse);

    // Insert director data
    const createdDirectors = await Director.insertMany(directors);
    console.log(`${createdDirectors.length} directors added`.green.inverse);

    // Insert actor data
    const createdActors = await Actor.insertMany(actors);
    console.log(`${createdActors.length} actors added`.green.inverse);

    // Assign relationships and insert movie data
    const moviesWithRelations = movies.map((movie, index) => {
      // Assign director (rotate through available directors)
      const directorIndex = index % createdDirectors.length;
      const director = createdDirectors[directorIndex]._id;

      // Assign 2-3 actors (rotate and vary the selection)
      const numActors = 2 + (index % 2); // Either 2 or 3 actors
      const actors = [];
      for (let i = 0; i < numActors; i++) {
        const actorIndex = (index + i) % createdActors.length;
        actors.push(createdActors[actorIndex]._id);
      }

      // Assign 1-3 genres (rotate and vary the selection)
      const numGenres = 1 + (index % 3); // 1, 2 or 3 genres
      const genres = [];
      for (let i = 0; i < numGenres; i++) {
        const genreIndex = (index + i) % createdGenres.length;
        genres.push(createdGenres[genreIndex]._id);
      }

      return {
        ...movie,
        director,
        actors,
        genres
      };
    });

    const createdMovies = await Movie.insertMany(moviesWithRelations);
    console.log(`${createdMovies.length} movies added`.green.inverse);

    // Update directors with their movies
    for (const movie of createdMovies) {
      await Director.findByIdAndUpdate(
        movie.director,
        { $push: { movies: movie._id } }
      );
    }

    // Update actors with their movies
    for (const movie of createdMovies) {
      for (const actorId of movie.actors) {
        await Actor.findByIdAndUpdate(
          actorId,
          { $push: { movies: movie._id } }
        );
      }
    }

    // Update genres with their movies
    for (const movie of createdMovies) {
      for (const genreId of movie.genres) {
        await Genre.findByIdAndUpdate(
          genreId,
          { $push: { movies: movie._id } }
        );
      }
    }

    console.log('Relationships updated for all models'.cyan.inverse);
    console.log('Data Import Completed!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete all data
const destroyData = async () => {
  try {
    await Movie.deleteMany();
    await Director.deleteMany();
    await Actor.deleteMany();
    await Genre.deleteMany();

    console.log('All data deleted!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Run the appropriate function based on command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 