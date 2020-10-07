const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

// ÄLÄ KOSKAAN TALLETA SALASANOJA githubiin!
/*const url =
  'mongodb+srv://fullstack:'+password+'@cluster0.lnopm.mongodb.net/phonebook?retryWrites=true&w=majority'
*/

console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    }
  })

  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

//const Person = mongoose.model('Person', personSchema)
module.exports = mongoose.model('Person', personSchema)