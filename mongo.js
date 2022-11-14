const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb://JKokko:${password}@ac-w0il9x3-shard-00-00.jcjerrv.mongodb.net:27017,ac-w0il9x3-shard-00-01.jcjerrv.mongodb.net:27017,ac-w0il9x3-shard-00-02.jcjerrv.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-jepd8h-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', numberSchema)


if(process.argv.length > 3){


  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })

}