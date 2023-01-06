require('dotenv').config()
const express = require('express')
const Joi = require('joi')
const app = express()
const helmet = require('helmet')
const morgan = require('morgan')
const mid1 = require('./logger')


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
// third party
app.use(helmet())
app.use(morgan('tiny'))

app.use(mid1)

const port = process.env.PORT || 4000

const movies = [
  { name: 'matrix', id: 1, genre: 'science fiction' },
  { name: 'harry potterr', id: 2, genre: 'fantasy' },
  { name: 'taxy driver', id: 1, genre: 'drama' },
]

const validateMovie = movie => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    genre: Joi.string().min(3).max(14).required(),
  })
  return schema.validate(movie)
}

app.get('/', (req, res) => res.send(movies.map(m => m.genre)))

app.post('/api/movie', (req, res) => {
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

app.put('/api/movie/:id', (req, res) => {
  let movie = movies.find(m => m.id == req.params.id)
  if (!movie) {
    return res.status(404).send('movie not found')
  }
  const { error } = validateMovie(req.body)
  if (error) {
    console.log(error)
    return res.status(404).send(error[0].details)
  }
  movie.name= req.body.name;
  movie.genre= req.body.genre;
  console.log(movies)
  return res.send(movie)
})

app.delete('/api/movie/:id', (req, res) => {
  const movie = movies.find(m => m.id == req.params.id)
  if (movie) {
    const index = movies.indexOf(movie)
    movies.splice(index, 1)
    return res.send(movie)
  }
  res.status(404).send('movie not found')
})

app.listen(port, () => console.log(`listening on ${port}`))
