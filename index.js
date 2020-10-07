const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const { res } = require('express')
const app = express()

app.use(express.json())
morgan.token('body', (req, response) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res, next) => {
    Person.find().then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
      })
      .catch(error => next(error))
})

app.get('/api/info', (req, res) => {
    Person.find().then(person => {
        res.send("Phonebook has info for " + person.length + " people <br>" + new Date())
      })
    
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})
  
app.post('/api/persons', (req, res, next) => {
    const body = req.body
  
    if (Object.keys(body).length === 0) {
        return res.status(400).json({ 
          error: 'content missing' 
        })
        .catch(error => next(error))
    } else if (!body.name) {
        return res.status(400).json({
            error: 'name missing' 
        })
        .catch(error => next(error))
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number missing' 
        })
        .catch(error => next(error))
    }/* else if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name is not unique' 
        })
    }*/
  
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
        res.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
  })

  app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const body = req.body

    if (!body) {
        return res.status(400).json({ 
          error: 'content missing' 
        })
        .catch(error => next(error))
    }
  
    const person = {
        id:id,
        name: body.name,
        number: body.number
    }
  
    Person.findByIdAndUpdate(id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message})
    }
  
    next(error)
  }

  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
  })