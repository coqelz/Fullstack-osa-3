const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan('tiny'))

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))
require('dotenv').config()



const Person = require('./models/person')
  
  app.get('/info', (req, res) => {
    Person.count({}).then(count => {
      res.send(`<p>Phonebook has info for ${count} people</p> 
    <p>${new Date()}</p>`)
  })
  })
  
  app.get('/api/persons', (req, res) => {
    Person.find({}).then(all => {
      res.json(all)
    }).catch(err => next(err))
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if(person) {
      response.json(person)
      } else {
        response.status(404).end()
      }
    }).catch(err => next(err))
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id).then(res => {
      response.status(204).end()
    }).catch(err => {
      console.log(err)
      response.status(400).send({ error: 'malformatted id' })
    })
  })

  const generateId = () => {
    const id = Math.random() * 1000000
    return Math.floor(id)
  }

  app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const newPerson = {
      name: body.name,
      number: body.number,
    }
    Person.findByIdAndUpdate(req.params.id, newPerson, {new: true}).then(person => {
      res.json(person)
    }).catch(err => next(err))
  })


  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

  app.post('/api/persons', (request, response, next) => {
   const body = request.body
   if(!body.name){
    return response.status(400).json({
      error: 'name missing'
    })
   } else if(!body.number){
    return response.status(400).json({
      error: 'number missing'
    })
   }
   
   const person = new Person({
    name: body.name,
    number: body.number,
   })

   person.save().then(res => {
    response.json(res)
   })
  })

  app.use(morgan('tiny'))

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }
  
  app.use(errorHandler)
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })