
const mongoose = require('mongoose')
const config = require('./utils/config')

const {model,Schema} = mongoose

const connectionString= config.MONGO_DB_URI

mongoose.connect(connectionString,{

}).then(() =>{
    console.log('database connect')
}).catch(err =>{
    console.log(err)
})

 
//porci alcaso
//"test": "node --test"

//"test": "jest --verbose"