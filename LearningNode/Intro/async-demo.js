//fs is a method that reads files, it can appendFile, open, writeFile
fs = require('fs');

function phoneNumber(err, data){
    console.log('data:', data);
}

//Instead of the execution waiting for readdir to finish, it goes onto the next line, then when readdir finishes it calls the function (callback) to execute the console.log
fs.readdir('c:/', phoneNumber);

console.log("this comes after");