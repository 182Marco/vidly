require("dotenv").config();
const express = require("express");
const Joi = require("joi");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const mid1 = require("./middlewares/logger");
const config = require("config");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const moviesRouter = require("./routes/movies");
const mongoose = require("mongoose");

const movieShema = new mongoose.Schema({
  id: Number,
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Movie = mongoose.model("Movie", movieShema); // Movie it's a class


const createMovie = async () => {
  const movie = new Movie({
    name: "scary movie",
    author: "a dush",
    tags: [`funny`, `commedy`],
    isPublished: true,
  });
  const result = await movie.save()
  console.log(result)
}

createMovie()

app.use("/api/movie", moviesRouter);

app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// third party
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan Enabled");
}

dbDebugger("connnected to the db");

app.use(mid1);

mongoose.set("strictQuery", true);
mongoose
  .connect(config.get("db"))
  .then(() => console.log("connected to mongoDB..."))
  .catch((er) => console.er("error:", er));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`listening on ${port}`));
