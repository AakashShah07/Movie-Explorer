import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { discoverMovies, getMovieCast, getMovieDetails } from "./services/tmdbservice.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/discover", async (req, res) => {
  const data = await discoverMovies();
  res.json(data);
});

app.get("/api/movie/:id", async (req, res) => {
  const data = await getMovieDetails(req.params.id);
  res.json(data);
});

app.get("/api/cast/:id", async (req, res) => {
  const data = await getMovieCast(req.params.id);
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
