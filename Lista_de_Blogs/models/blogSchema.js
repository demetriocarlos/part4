
const mongoose = require('mongoose')
const {model,Schema} =require('mongoose')

 

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes:  {
      type: Number,
      default: 0, // Valor predeterminado de 0 para "likes"
    },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]

  })

  blogSchema.set('toJSON', {    
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id
      delete returnedObject._id
      delete returnedObject.__v
    }
})


const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog