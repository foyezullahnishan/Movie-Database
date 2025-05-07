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

// Additional directors
const additionalDirectors = [
  {
    name: 'Bong Joon-ho',
    birthYear: 1969,
    bio: 'Bong Joon-ho is a South Korean film director, producer and screenwriter. His films feature social themes, genre-mixing, black humor, and sudden tone shifts. He first became known for his second film, the crime drama Memories of Murder (2003).',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Bong_Joon-ho%2C_2019.jpg/330px-Bong_Joon-ho%2C_2019.jpg'
  },
  // ... keep existing additionalDirectors ...
];

// Additional actors
const additionalActors = [
  {
    name: 'Song Kang-ho',
    birthYear: 1967,
    bio: 'Song Kang-ho is a South Korean actor. He is widely regarded as one of the greatest actors in Korean cinema and has starred in several critically acclaimed South Korean films.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Song_Kang-ho_2016.jpg'
  },
  {
    name: 'Lee Sun-kyun',
    birthYear: 1975,
    bio: 'Lee Sun-kyun was a South Korean actor who starred in various television series and films, notably in Parasite (2019), which won the Palme d\'Or at the Cannes Film Festival.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Lee_Sun-kyun_at_the_2018_%EB%B0%B1%EC%83%81_%EC%98%88%EC%88%A0%EB%8C%80%EC%83%81.jpg/330px-Lee_Sun-kyun_at_the_2018_%EB%B0%B1%EC%83%81_%EC%98%88%EC%88%A0%EB%8C%80%EC%83%81.jpg'
  },
  {
    name: 'Cho Yeo-jeong',
    birthYear: 1981,
    bio: 'Cho Yeo-jeong is a South Korean actress known for her roles in The Servant (2010), The Concubine (2012), and Parasite (2019).',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Cho_Yeo-jeong_in_2019.jpg/330px-Cho_Yeo-jeong_in_2019.jpg'
  },
  {
    name: 'Choi Woo-shik',
    birthYear: 1990,
    bio: "Choi Woo-shik is a South Korean actor. He is known for his roles in the films Train to Busan (2016), Parasite (2019), and Netflix's show The Package.",
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Choi_Woo-shik_in_December_2019.jpg/330px-Choi_Woo-shik_in_December_2019.jpg'
  },
  // ... keep existing additionalActors ...
];

// Additional genres
const additionalGenres = [
  // ... keep existing additionalGenres ...
];

// Additional movies data
const additionalMovies = [
  {
    title: 'The Matrix',
    plot: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    releaseYear: 1999,
    runtime: 136,
    poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'
  },
  {
    title: 'Forrest Gump',
    plot: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
    releaseYear: 1994,
    runtime: 142,
    poster: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg'
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    plot: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
    releaseYear: 2001,
    runtime: 178,
    poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg'
  },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    plot: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire\'s world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.',
    releaseYear: 1977,
    runtime: 121,
    poster: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg'
  },
  {
    title: 'Titanic',
    plot: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    releaseYear: 1997,
    runtime: 194,
    poster: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg'
  },
  {
    title: 'The Silence of the Lambs',
    plot: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.',
    releaseYear: 1991,
    runtime: 118,
    poster: 'https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0Gg9vK.jpg'
  },
  {
    title: 'The Green Mile',
    plot: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.',
    releaseYear: 1999,
    runtime: 189,
    poster: 'https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg'
  },
  {
    title: 'The Godfather: Part II',
    plot: 'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.',
    releaseYear: 1974,
    runtime: 202,
    poster: 'https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg'
  },
  {
    title: 'Schindler\'s List',
    plot: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
    releaseYear: 1993,
    runtime: 195,
    poster: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg'
  },
  {
    title: 'Gladiator',
    plot: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    releaseYear: 2000,
    runtime: 155,
    poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg'
  },
  {
    title: 'The Lion King',
    plot: 'Lion cub and future king Simba searches for his identity. His eagerness to please others and penchant for testing his boundaries sometimes gets him into trouble.',
    releaseYear: 1994,
    runtime: 88,
    poster: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg'
  },
  {
    title: 'Parasite',
    plot: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    releaseYear: 2019,
    runtime: 132,
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'
  },
  {
    title: 'Whiplash',
    plot: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
    releaseYear: 2014,
    runtime: 107,
    poster: 'https://image.tmdb.org/t/p/w500/oPxnRhyAIzJKGUEdSiwTJQBa3NM.jpg'
  },
  {
    title: 'Joker',
    plot: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.',
    releaseYear: 2019,
    runtime: 122,
    poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg'
  },
  {
    title: 'Avengers: Endgame',
    plot: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
    releaseYear: 2019,
    runtime: 181,
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg'
  },
  {
    title: 'The Truman Show',
    plot: 'An insurance salesman discovers his whole life is actually a reality TV show.',
    releaseYear: 1998,
    runtime: 103,
    poster: 'https://image.tmdb.org/t/p/w500/vuza0WqY239yBXOadKlGwJsZJFE.jpg'
  },
  {
    title: 'Avatar',
    plot: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
    releaseYear: 2009,
    runtime: 162,
    poster: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg'
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    plot: 'Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.',
    releaseYear: 2018,
    runtime: 117,
    poster: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg'
  },
  {
    title: 'The Shining',
    plot: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.',
    releaseYear: 1980,
    runtime: 146,
    poster: 'https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2hy.jpg'
  },
  {
    title: 'Blade Runner 2049',
    plot: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
    releaseYear: 2017,
    runtime: 164,
    poster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg'
  }
];

// Import data
const importAdditionalData = async () => {
  try {
    // Get existing genres, directors, and actors
    const existingGenres = await Genre.find({});
    const existingDirectors = await Director.find({});
    const existingActors = await Actor.find({});

    console.log(`Found ${existingGenres.length} existing genres`.blue);
    console.log(`Found ${existingDirectors.length} existing directors`.blue);
    console.log(`Found ${existingActors.length} existing actors`.blue);

    // Insert additional genres
    const createdGenres = await Genre.insertMany(
      additionalGenres.filter(g => !existingGenres.some(eg => eg.name === g.name))
    );
    console.log(`${createdGenres.length} additional genres added`.green.inverse);

    // Insert additional directors 
    const createdDirectors = await Director.insertMany(
      additionalDirectors.filter(d => !existingDirectors.some(ed => ed.name === d.name))
    );
    console.log(`${createdDirectors.length} additional directors added`.green.inverse);

    // Insert additional actors
    const createdActors = await Actor.insertMany(
      additionalActors.filter(a => !existingActors.some(ea => ea.name === a.name))
    );
    console.log(`${createdActors.length} additional actors added`.green.inverse);

    // Combine existing and new records
    const allGenres = [...existingGenres, ...createdGenres];
    const allDirectors = [...existingDirectors, ...createdDirectors];
    const allActors = [...existingActors, ...createdActors];

    // Process each additional movie
    for (const movieData of additionalMovies) {
      // Check if movie already exists
      const existingMovie = await Movie.findOne({ title: movieData.title });
      
      if (existingMovie) {
        console.log(`Movie "${movieData.title}" already exists, skipping...`.yellow);
        continue;
      }

      // Special handling for Parasite
      if (movieData.title === 'Parasite') {
        const bongJoonHo = allDirectors.find(d => d.name === 'Bong Joon-ho');
        const songKangHo = allActors.find(a => a.name === 'Song Kang-ho');
        const leeSunKyun = allActors.find(a => a.name === 'Lee Sun-kyun');
        const choYeoJeong = allActors.find(a => a.name === 'Cho Yeo-jeong');
        const choiWooShik = allActors.find(a => a.name === 'Choi Woo-shik');
        
        const dramaGenre = allGenres.find(g => g.name === 'Drama');
        const thrillerGenre = allGenres.find(g => g.name === 'Thriller');
        
        if (bongJoonHo && songKangHo && dramaGenre && thrillerGenre) {
          const parasiteActors = [
            songKangHo._id,
            leeSunKyun?._id,
            choYeoJeong?._id, 
            choiWooShik?._id
          ].filter(id => id); // Remove undefined values
          
          const movie = await Movie.create({
            ...movieData,
            director: bongJoonHo._id,
            actors: parasiteActors,
            genres: [dramaGenre._id, thrillerGenre._id]
          });
          
          // Update references
          await Director.findByIdAndUpdate(bongJoonHo._id, { 
            $push: { movies: movie._id } 
          });
          
          for (const actorId of parasiteActors) {
            await Actor.findByIdAndUpdate(actorId, { 
              $push: { movies: movie._id } 
            });
          }
          
          await Genre.findByIdAndUpdate(dramaGenre._id, { 
            $push: { movies: movie._id } 
          });
          
          await Genre.findByIdAndUpdate(thrillerGenre._id, { 
            $push: { movies: movie._id } 
          });
          
          console.log(`Special movie "Parasite" added with correct director and cast`.green);
          continue;
        }
      }

      // ... existing logic for other movies ...

      // Randomly assign director, actors, and genres
      const director = allDirectors[Math.floor(Math.random() * allDirectors.length)]._id;
      
      // Select 2-4 random actors
      const numActors = 2 + Math.floor(Math.random() * 3); // 2 to 4 actors
      const actorIds = [];
      for (let i = 0; i < numActors; i++) {
        const randomActor = allActors[Math.floor(Math.random() * allActors.length)];
        if (!actorIds.includes(randomActor._id)) {
          actorIds.push(randomActor._id);
        }
      }
      
      // Select 1-3 random genres
      const numGenres = 1 + Math.floor(Math.random() * 3); // 1 to 3 genres
      const genreIds = [];
      for (let i = 0; i < numGenres; i++) {
        const randomGenre = allGenres[Math.floor(Math.random() * allGenres.length)];
        if (!genreIds.includes(randomGenre._id)) {
          genreIds.push(randomGenre._id);
        }
      }

      // Create the movie
      const movie = await Movie.create({
        ...movieData,
        director,
        actors: actorIds,
        genres: genreIds
      });

      // Update director's movies array
      await Director.findByIdAndUpdate(director, {
        $push: { movies: movie._id }
      });

      // Update actors' movies array
      for (const actorId of actorIds) {
        await Actor.findByIdAndUpdate(actorId, {
          $push: { movies: movie._id }
        });
      }

      // Update genres' movies array
      for (const genreId of genreIds) {
        await Genre.findByIdAndUpdate(genreId, {
          $push: { movies: movie._id }
        });
      }

      console.log(`Movie "${movie.title}" added`.cyan);
    }

    console.log('Additional Data Import Complete!'.green.inverse);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Run the function
importAdditionalData(); 