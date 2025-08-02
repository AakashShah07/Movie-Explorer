import axios from "axios";
import fs from "fs";
import path from "path";

const BASE_URL = "https://api.themoviedb.org/3";

// const fallbackPath = path.join(process.cwd(), "data", "fallback.json");
// const fallbackData = JSON.parse(fs.readFileSync(fallbackPath, "utf8"));

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

// Discover Movies
export async function discoverMovies(page =1 ) {
   try {
    console.log("Token being sent:");
    const res = await tmdbApi.get(`/discover/movie?page=${page}`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("TMDb API error (discover):", err.response?.data || err.message);
  }
}



// Movie Details
export async function getMovieDetails(id) {
  try {
    const res = await tmdbApi.get(`/movie/${id}` ,{
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("TMDb API error (details):", err.message);
    // return fallbackData.movieDetails.find((m) => m.id == id);
  }
}

// Cast & Crew
export async function getMovieCast(id) {
  try {
    const res = await tmdbApi.get(`/movie/${id}/credits`,{
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("TMDb API error (cast):", err.message);
    // return fallbackData.cast.find((c) => c.id == id);
  }
}
