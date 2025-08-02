import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { discoverMovies, getMovieCast, getMovieDetails } from "./services/tmdbservice.js";
import { initDB, Movie, Genre, Cast } from "./models/index.js";
import { Op } from "sequelize";


const app = express();
app.use(express.json()); // For parsing JSON request bodies
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjdfjdhgfgfiguifuidfjdndifjid";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // Attach user data to request
    next();
  });
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

 
  if (username === "admin" && password === "password") {
    const user = { username }; // payload
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});


await initDB();
app.get("/api/discover", authenticateToken, async (req, res) => {
  const data = await discoverMovies();
  res.json(data);
});

app.get("/api/movie/:id", authenticateToken, async (req, res) => {
  const data = await getMovieDetails(req.params.id);
  res.json(data);
});

app.get("/api/cast/:id", authenticateToken, async (req, res) => {
  const data = await getMovieCast(req.params.id);
  res.json(data);
});

app.get("/api/movies", authenticateToken, async (req, res) => {
  try {
    const {
      page = 1, 
      limit = 10,
      year,
      genres,
      without_genres,
      sort_by = "popularity",
      order = "desc",
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // ✅ Filter by year
    if (year) {
      where.release_date = {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`]
      };
    }

    // ✅ Search by title (we will also check cast below)
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }

    // ✅ Build includes (for genres & cast)
    const include = [];

    // Filter by genres (must have)
    if (genres) {
      include.push({
        model: Genre,
        where: { id: genres.split(",") },
        through: { attributes: [] },
        required: true
      });
    }

    // Filter without genres (must not have)
    if (without_genres) {
      include.push({
        model: Genre,
        where: { id: { [Op.notIn]: without_genres.split(",") } },
        through: { attributes: [] },
        required: false
      });
    }

    // Search also in cast names
    if (search) {
      include.push({
        model: Cast,
        where: { name: { [Op.iLike]: `%${search}%` } },
        through: { attributes: [] },
        required: false
      });
    }

    // ✅ Fetch paginated movies
    const movies = await Movie.findAndCountAll({
      where,
      include,
      offset,
      limit: parseInt(limit),
      order: [[sort_by, order.toUpperCase()]],
      distinct: true
    });

    // ✅ Send response
    res.json({
      page: parseInt(page),
      totalPages: Math.ceil(movies.count / limit),
      total: movies.count,
      data: movies.rows
    });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
