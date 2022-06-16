//require reads a js file, executes it then proceeds to return the export object
//here, the methods are being imported as the object exported from myModule
const {myText, myText2, myCounter} = require('./myModule.js')

console.log(myModule.myText)
console.log(myModule.myText2)
console.log(myModule.myCounter())
