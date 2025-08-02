import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

// Models
export const Movie = sequelize.define("Movie", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  title: DataTypes.STRING,
  release_date: DataTypes.DATE,
  popularity: DataTypes.FLOAT,
  vote_average: DataTypes.FLOAT,
  vote_count: DataTypes.INTEGER,
  revenue: DataTypes.BIGINT,
  overview: DataTypes.TEXT,
  poster_path: DataTypes.STRING,
  backdrop_path: DataTypes.STRING,
});

export const Genre = sequelize.define("Genre", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  name: DataTypes.STRING,
});

export const Cast = sequelize.define("Cast", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  name: DataTypes.STRING,
  character: DataTypes.STRING,
  profile_path: DataTypes.STRING,
});

// Relations
Movie.belongsToMany(Genre, { through: "MovieGenre" });
Genre.belongsToMany(Movie, { through: "MovieGenre" });

Movie.belongsToMany(Cast, { through: "MovieCast" });
Cast.belongsToMany(Movie, { through: "MovieCast" });

export async function initDB() {
  await sequelize.sync({ force: false }); // set force:true only for first time
  console.log("✅ Database synced");
}
