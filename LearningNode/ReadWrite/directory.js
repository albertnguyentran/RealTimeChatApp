fs = require('fs')

//Callback function executes once readdir finishes, however it is not synchronous, it is async
//The err is a paremeter passed automatically into the function by the method, if an err does occur, it will be stored as the var err
fs.readdir('/System/Library', (err, data) => {
    console.log(data)
})

