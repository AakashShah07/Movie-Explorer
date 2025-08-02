import dotenv from "dotenv";
import {
  discoverMovies,
  getMovieDetails,
  getMovieCast,
} from "../services/tmdbservice.js";
// import { discoverMovies, getMovieDetails, getMovieCast } from "../src/services/tmdbService.js";
import { initDB, Movie, Genre, Cast } from "../models/index.js";
// import { initDB, Movie, Genre, Cast } from "../src/models/index.js";

dotenv.config();

async function safeGetMovieCast(movieId, retries = 2) {
  try {
    return await getMovieCast(movieId);
  } catch (err) {
    if (retries > 0) {
      console.log(`🔄 Retrying cast for movie ${movieId}...`);
      return safeGetMovieCast(movieId, retries - 1);
    }
    console.warn(`⚠️ Cast fetch failed for movie ${movieId}: ${err.message}`);
    return { cast: [] }; // Always return safe empty array
  }
}


async function fetchAndSeed() {
  try {
    await initDB();

    let allMovies = [];
    let page = 1;

    // Fetch until we have 500 movies
    while (allMovies.length < 500) {
      const data = await discoverMovies(page);
      allMovies = [...allMovies, ...data.results];
      page++;
    }

    // Trim to 500
    allMovies = allMovies.slice(0, 500);
    console.log(`🎬 Total movies fetched: ${allMovies.length}`);

    for (const movie of allMovies) {
      // Check if movie already exists
      const exists = await Movie.findByPk(movie.id);
      if (exists) continue;

      // Get movie details
      const details = await getMovieDetails(movie.id);

      // Save movie
      const newMovie = await Movie.create({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        popularity: movie.popularity,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        revenue: details.revenue,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
      });

      // Genres
      for (const g of details.genres) {
        const [genre] = await Genre.findOrCreate({
          where: { id: g.id },
          defaults: { name: g.name },
        });
        await newMovie.addGenre(genre);
      }

      // Cast
      // Fetch cast
      // let credits;
      // Cast - always returns a safe object
      const credits = await safeGetMovieCast(movie.id);

      // Only proceed if credits and credits.cast exist
      if (credits && Array.isArray(credits.cast)) {
        for (const c of credits.cast.slice(0, 5)) {
          // Limit top 5
          const [cast] = await Cast.findOrCreate({
            where: { id: c.id },
            defaults: {
              name: c.name,
              character: c.character,
              profile_path: c.profile_path,
            },
          });
          await newMovie.addCast(cast);
        }
      }

      console.log(`✅ Added movie: ${movie.title}`);
    }

    console.log("🎉 Seeding completed!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeder error:", error.message);
    process.exit(1);
  }
}

fetchAndSeed();
