//Require the module fs to read files
fs = require('fs')

//Alternatively you can just import the object from the file directly
const data = require('./data.json')
//Then print it
console.log(data.name)
console.log(data.age)

//Or you can read the file, but this returns a string because you are using readFile
fs.readFile('./data.json', 'utf-8', (err, data) => {
    //Then parse the json in it's string form into js objects
    var data = JSON.parse(data)
    //Where we are able to use them to locate the methods we want
    console.log(data.name)
    console.log(data.age)
})