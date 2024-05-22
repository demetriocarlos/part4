

const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/User')

/*
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})
*/

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blog', {url:1,title:1,author:1, id:1})

  response.json(users)
})


usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error:  'El nombre de usuario y la contraseña son obligatorios' });
  }

  if (username.length < 3 || password.length < 3) {
    return res.status(400).json({ error: 'El nombre de usuario y la contraseña deben tener al menos 3 caracteres' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
  }


  const saltRounds = 10;

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, name, passwordHash });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Algo salió mal' });
  }
});





module.exports = usersRouter