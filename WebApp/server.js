//How this works
//Whenever a message is sent, socket.io emits the message contained within the post request, and the event listener attached to the same socket calls the function addMessages to post it on the website
//Using jquery's document ready event function, it calls the get request function whenever the website is reloaded, which in turn returns all the messages contained in the mongodb database
//These messages are then uploaded to the website using the function addMessages as well

var express = require('express')
var bodyParser = require('body-parser')
var app = express()
//Setting up http server tied to the app
var http = require('http').Server(app)
//Pass in io reference to http
var io = require('socket.io')(http)
//Setting up mongoose (Object Data modelling library that will allow us to create an Object Scheme on how we want to represent the data we put into the mongodb database)
var mongoose = require('mongoose')
var Filter = require('bad-words')
const { request } = require('http')
var filter = new Filter()

//Makes it possible to access files from the __dirname file
app.use(express.static(__dirname))

//app.use sets up the bodyParser as middleware
//the following .json() tells the bodyParser method to expect JSON to be coming in with the HTTP request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//Letting mongoose know that the Promise library we want to use is the default ES6 library
mongoose.Promise = Promise

//This is the mongodb database access link
var dbUrl = 'mongodb+srv://user:pass@cluster0.twhcx.mongodb.net/?retryWrites=true&w=majority'

//Captail M for Message indicates that this is a model
//Here we can design what we want our scheme to look like and what kind of data each variable should hold
//In this case both will be strings
var Message = mongoose.model('Message', {
    name: String,
    message: String,
    votes: Number

})


//Creates an endpoint at route /messages
//GET simply means retrieve data from a specified resource
//Here we are routing all get requests to the specified path with the specified callback functions 
//Response is to return the var messages
app.get('/messages', (req, res) => {
    //We want to select all of the messages, so you don't want to pass in anything in the object
    //This way, whenever a new client opens up the browser, they load up all past messages stored in the mongodb database
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({name: user}, (err, messages) => {
        res.send(messages)
    })
})

app.get('/messages/:id', (req, res) => {
    Message.find({_id: req.params.id}, (err, messages) => {
        res.send(messages.votes)
        console.log('hi')
        console.log(messages.votes)
    })
})

/* Demo async/await function that catches an error and logs it if there is one, and logs the result if there isn't
async myFunction() {
    try {
        let result = await request()
        console.log(result)
    } catch (error) {
        console.log(error)
    }
} */

//POST simply means submit data to be processed to a specificed resource
//Here we are routing all post requests to the specified path with the specified callback functions 
//Whenever a post request is made, the data is emitted to the socket message
app.post('/messages', async (req, res) => {
    try {
        //This var is connected to mongoose which is connected to mongodb
        var message = new Message(req.body)

        //The await operator is used to wait for a promise
        //If the promise is rejected, the error is thrown
        var savedMessage = await message.save()
        
        console.log('saved')
        
        var censored =  await Message.findOne({message: 'badword'})

        console.log(req.body.name)
        console.log(req.body)
        

        if (filter.isProfane(req.body.name) || filter.isProfane(req.body.message)) {
            
            await Message.remove({name: req.body.name, message: req.body.message})
            io.emit('alert')
        }

        else {
            //If there is no error, you will receive status 200 and not 500
            //Whenever a post request is to made to the /messages endpoint, io will emit the req.body to the socket 'message'
            io.emit('message', message)
        }
        res.sendStatus(200)

    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {  //finally executes regardless of whether the try catch block executes or not
        console.log('message post called')
    }
})

app.delete('/messages/:id', (req, res) => {
    console.log(req.params.id)
    Message.findByIdAndDelete({_id: req.params.id}, (err, message) => {
        if (err) {
            console.log(err)
        } 
        else {
            res.send(message)
            io.emit('delete', req.params.id)
        }
    })
        
  
 
})

app.put('/messages/:id', (req, res) => {
    Message.findByIdAndUpdate({_id: req.params.id}, {$inc: {votes: req.body.votes}}, (err, message) => {
        if (req.body.votes === '1'){
            io.emit('upVote', req.params.id)
        }
        if (req.body.votes === '-1'){
            io.emit('downVote', req.params.id)
        }
        res.send(message)
    })
})

//io can start listening for events with the on method
//In this case we are telling it to listen for connections
io.on('connection', (socket) => {
    console.log('a user connected')
})

//Here we are connecting mongoose to our mongodb database with the database link
mongoose.connect(dbUrl, (err) => {
    console.log('mongo db connection', err)
})

//HTTP is running on port 3000
//instead of the server running on app.listen..., http allows both express and socket.io to run together
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})




/*
app.post('/messages', (req, res) => {

    //This var is connected to mongoose which is connected to mongodb
    var message = new Message(req.body)

    //The then will execute if there are no errors
    //Alternatively if you did message.save((err) => { ... }), the callback is always called
    message.save()
    
    .then(() => {
        console.log('saved')
        //Then returns a promise instead of handling it with a callback
        //The returned promise can be passed through another then method as a parameter
        //And if there is an error, it is caught with the catch method
        return Message.findOne({message: 'badword'})
    })

    //The next then that is chained on, uses the previous promise as its parameter
    .then(censored => {
        if (censored){
            console.log('censored words found', censored)
            //If a censored word is found, the Message.remove(message) is returned
            //And because there is not a then chained onto after this, the function ends here
            return Message.remove({_id: censored.id})
        }

        //If there is no error, you will receive status 200 and not 500
        //Whenever a post request is to made to the /messages endpoint, io will emit the req.body to the socket 'message'
        io.emit('message', req.body)
        res.sendStatus(200)

    })
    .catch((err) => {
        res.sendStatus(500)
        return console.error(err)
    })
})
*/