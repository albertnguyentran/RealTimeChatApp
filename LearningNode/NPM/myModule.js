//syntax, exports.var = function or variable
//when imported, the variable/function can be used, like react components
exports.myText = "hello from module"
exports.myText2 = "test"
exports.myCounter = () => {
    count = 0

    for(var i=0; i<11; i++){
        count = count + i
    }

    return count


}

