
const mongoose = require('mongoose')
const {model,Schema} =require('mongoose')


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true ,// esto asegura la unicidad de username
    minlength: 3
  },
    name: String,
    passwordHash:{
      type: String,
      required: true,
      minlength: 3
    },
    blog: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
      }
    ]
  })

   


  userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // el passwordHash no debe mostrarse
      delete returnedObject.passwordHash
    }
  })


  const User = mongoose.model('User', userSchema)

module.exports = User