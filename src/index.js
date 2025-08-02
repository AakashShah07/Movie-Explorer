require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Movie Explorer API is running"));

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));
