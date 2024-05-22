const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')

const tokenExtractor = require('./middleware/tokenExtractor')

const blogRouter = require('./controllers/blog')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
//const middleware= require('./utils/middleware')
require('./mongo')


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// Registra el middleware tokenExtractor para que se aplique a todas las rutas
app.use(tokenExtractor);

app.use(middleware.requestLogger)


/// Usa el middleware solo en las rutas de api/blogs
app.use('/api/blogs',middleware.userExtractor ,blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login',loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app