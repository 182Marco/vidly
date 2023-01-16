const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");

// const movies = [
//   { name: 'matrix', id: 1, genre: 'science fiction' },
//   { name: 'harry potterr', id: 2, genre: 'fantasy' },
//   { name: 'taxy driver', id: 1, genre: 'drama' },
// ]

const validateGenre = (movie) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
  });
  return schema.validate(movie);
};

const Genre = mongoose.model(
  "movies",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      lowercase: true,
      trim: true,
    },
  })
);

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.render("index", {
    title: "This is the title",
    message: JSON.stringify(genres),
  });
});

router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);

  if (!error) {
    const genre = new Genre({
      name: req.body.name,
    });
    genre.save();
    return res.send(genre);
  }
  return res.send(error.details);
});

router.put("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  genre ? res.send(genre) : res.status(404).send("id not found");
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  genre ? res.send(genre) : res.status(404).send("id not found");
});

module.exports = router;
