const express = require('express')
const router = express.Router()

const movies = [
  { name: 'matrix', id: 1, genre: 'science fiction' },
  { name: 'harry potterr', id: 2, genre: 'fantasy' },
  { name: 'taxy driver', id: 1, genre: 'drama' },
]

const validateMovie = (movie) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    genre: Joi.string().min(3).max(14).required(),
  })
  return schema.validate(movie)
}

router.get('/', (req, res) => {
  res.render('index', {
    title: 'This is the title',
    message: 'This is the msg',
  })
})

router.post('/', (req, res) => {
  const { error } = validateMovie(req.body)

  if (!error) {
    const movie = {
      name: req.body.name,
      genre: req.body.genre,
      id: movies.length + 1,
    }
    movies.push(movie)
    return res.send(movie)
  }
  return res.send(error.details)
})

router.put('/:id', (req, res) => {
  let movie = movies.find((m) => m.id == req.params.id)
  if (!movie) {
    return res.status(404).send('movie not found')
  }
  const { error } = validateMovie(req.body)
  if (error) {
    return res.status(404).send(error[0].details)
  }
  movie.name = req.body.name
  movie.genre = req.body.genre
  return res.send(movie)
})

router.delete('/:id', (req, res) => {
  const movie = movies.find((m) => m.id == req.params.id)
  if (movie) {
    const index = movies.indexOf(movie)
    movies.splice(index, 1)
    return res.send(movie)
  }
  res.status(404).send('movie not found')
})

module.exports = router
