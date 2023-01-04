require('dotenv').config()
const express = require('express')
const joi = require('joi')
const app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.json())

const port = process.env.PORT || 4000

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
  return schema.validate(movie, { abortEarly: false })
}

app.get('/', (req, res) => res.send(movies.map(m => m.genre)))

app.post('/api/movie', (req, res) => {
  const { error } = validateMovie(req)
  if (!error) {
    const movie = {
      name: req.body.name,
      genre: req.body.genre,
      id: movies.length + 1,
    }

    movies.push(movie)
    console.log(movies)
    return res.send(movie)
  }
  return res.send(error)
})

app.listen(port, () => console.log(`listening on ${port}`))
