exports.myText = "hello from module"
exports.myCounter = () => {
    count = 0

    for(var i=0; i<10; i++){
        count = count + i
    }

    return count
}