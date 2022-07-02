var express = require('express')
var bodyParser = require('body-parser')
var app = express()

//Makes it possible to acces files from the __dirname file
app.use(express.static(__dirname))
//app.use sets up the bodyParser as middleware
//the following .json() tells the bodyParser method to expect JSON to be coming in with the HTTP request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//Array
var messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Jane', message: 'Hello'}
]

//Creates an endpoint at route /messages
app.get('/messages', (req, res) => {
    res.send(messages)
})


app.post('/messages', (req, res) => {
    //Messages.push appends the req.body (request) into the messages array, which is then sent to the /messages endpoint and obtained and added with the function addMessages 
    messages.push(req.body)
    res.sendStatus(200)
})


//App is running on port 3000
var server = app.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})
