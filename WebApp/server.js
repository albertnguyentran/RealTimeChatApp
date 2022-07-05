var express = require('express')
var bodyParser = require('body-parser')
var app = express()
//Setting up http server tied to the app
var http = require('http').Server(app)
//Pass in io reference to http
var io = require('socket.io')(http)

//Makes it possible to access files from the __dirname file
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
//GET simply means retrieve data from a specified resource
//Here we are routing all get requests to the specified path with the specified callback functions 
//Response is to return the var messages
app.get('/messages', (req, res) => {
    res.send(messages)
})

//POST simply means submit data to be processed to a specificed resource
//Here we are routing all post requests to the specified path with the specified callback functions 
//Whenever a post request is made, the data is pushed into the messages array and the response is to send a status update to confirm its success
app.post('/messages', (req, res) => {
    messages.push(req.body)
    //Whenever a post request is to made to the /messages endpoint, io will emit the req.body to the socket 'message'
    io.emit('message', req.body)
    res.sendStatus(200)
})

//io can start listening for events with the on method
//In this case we are telling it to listen for connections
io.on('connection', (socket) => {
    console.log('a user connected')
})

//HTTP is running on port 3000
//instead of the server running on app.listen..., http allows both express and socket.io to run together
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})
