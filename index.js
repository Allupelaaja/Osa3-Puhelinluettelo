const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
  ]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/info', (req, res) => {
    res.send("Phonebook has info for " + persons.length + " people <br>" + new Date())
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        res.status(404).end()
    } else {
        res.json(person)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
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
    } else if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name is not unique' 
        })
    }
  
    const person = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
    }
  
    persons = persons.concat(person)
  
    res.json(person)
  })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})