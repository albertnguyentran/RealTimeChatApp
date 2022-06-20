var fs = require('fs')

var data = {
    name: "Bob"
}

//Second parameter requires us to stringify the var because the data argument cannot receive an instance of an Object
fs.writeFile('test.json', JSON.stringify(data), (err) => {
    if (err)
        console.log(err);
})