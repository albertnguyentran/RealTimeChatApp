fs = require('fs')

//Callback function executes once readdir finishes, however it is not synchronous, it is async
fs.readdir('/System/Library', (err, data) => {
    console.log(data)
})

