const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const app = express()

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find().then(person => {
        res.json(person)
      })
})

app.get('/api/info', (req, res) => {
    Person.find().then(person => {
        res.send("Phonebook has info for " + person.length + " people <br>" + new Date())
      })
    
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})
  
app.post('/api/persons', (req, res) => {
    const body = req.body
  
    if (!body) {
        return res.status(400).json({ 
          error: 'content missing' 
        })
    } else if (!body.name) {
        return res.status(400).json({
            error: 'name missing' 
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number missing' 
        })
    }/* else if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name is not unique' 
        })
    }*/
  
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
      })
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
  })