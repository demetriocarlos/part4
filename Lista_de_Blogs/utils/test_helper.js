const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Blog = require('../models/blogSchema');

// Datos iniciales de blogs para las pruebas
const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Author One',
    url: 'http://firstblog.com',
    likes: 5,
  },
  {
    title: 'Second Blog',
    author: 'Author Two',
    url: 'http://secondblog.com',
    likes: 10,
  }
];

// Función para obtener un ID que no existe en la base de datos
const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' });
  await blog.save();
  await blog.remove();
  return blog._id.toString();
};

// Función para obtener todos los blogs de la base de datos
const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

// Función para obtener todos los usuarios de la base de datos
const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

// Función para obtener un token de autenticación para un usuario de prueba
const getTokenForTestUser = async () => {
  const user = new User({ username: 'testuser', password: 'password' });
  await user.save();

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // Crea un token usando los datos del usuario
  const token = jwt.sign(userForToken, process.env.SECRET);

  return {
    token,
    user,
  };
};

// Exporta las funciones y datos auxiliares para ser utilizados en otros archivos
module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  getTokenForTestUser,
};
