Movie Explorer API
A Node.js + Express REST API that fetches and stores movie data from The Movie Database (TMDB) and provides a paginated movie listing with filtering and search options.
## Features
Features
* Fetches 500 movies from TMDB and seeds them into PostgreSQL.
* Stores movie details, genres, and top 5 cast members.
* Provides a paginated GET API with filters:
* year
* genres / without_genres
* search (by title or cast)
* Sortable by popularity, vote_average, vote_count, * release_date, revenue, title.
* JWT authentication for secured endpoints.


## Tech StackTech Stack
Node.js + Express for API

PostgreSQL + Sequelize ORM for DB

Axios for TMDB API calls

JWT for authentication


## SetUp Instructions

### 1 Clone the Repository

```bash
git clone https://github.com/your-username/movie-explorer.git
cd movie-explorer 
```

### 2 Install Depedencies

```bash
npm install 
```

### 3 Configure Environment Variables in .env file

```bash
PORT=4000
DB_NAME=movies
DB_USER=movieuser
DB_PASS=moviepass
DB_HOST=localhost
TMDB_BEARER_TOKEN=your_tmdb_api_token
JWT_SECRET=your_jwt_secret
```

### 4 Setup PostgreSQL

```bash
sudo -i -u postgres
psql
CREATE DATABASE movies;
CREATE USER movieuser WITH ENCRYPTED PASSWORD 'moviepass';
GRANT ALL PRIVILEGES ON DATABASE movies TO movieuser;
```

### 5 Seed the DATABASE

```bash
node src/scripts/fetchAndSeed.js
```

### 6 Start the server

```bash
npm run dev
```
## Demo

### API Endpoints

```bash
GET /api/movies

```

* Query Parameters:

* page (default: 1)

* limit (default: 10)
 
* year (filter by release year)
 
* genres (comma-separated genre IDs)
 
* without_genres (comma-separated genre  IDs)
 
* sort_by (popularity, vote_average, * vote_count, release_date, revenue, * title)

* order (asc, desc)
 
* search (search by title or cast name)


### Sample cURL

```bash
curl -H "Authorization: Bearer <your-token>" \
"http://localhost:4000/api/movies?page=1&limit=5&year=2022&sort_by=popularity&order=desc"


```
