var express = require('express')
var bodyParser = require('body-parser')
var app = express()

//Makes it possible to acces files from the __dirname file
app.use(express.static(__dirname))
//app.use sets up the bodyParser as middleware
//the following .json() tells the bodyParser method to expect JSON to be coming in with the HTTP request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
//Array
var messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Jane', message: 'Hello'}
]

//Sends the var messages on page /messages
app.get('/messages', (req, res) => {
    res.send(messages)
})


app.post('/messages', (req, res) => {
    //Here the console.log will return in JSON format because of the bodyParser.json() above to terminal
    //Messages.push appends the req.body into the messages array, which is then obtained and added with the function addMessages 
    console.log(req.body)
    messages.push(req.body)
    res.sendStatus(200)
})


//App is running on port 3000
var server = app.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})
