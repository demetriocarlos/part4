
const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const  Blog =require('../models/blogSchema')
const User= require('../models/User')

 


blogRouter.get('/',async (request, response) => {

  const blog = await Blog
    .find({}).populate('user', {username:1, name:1 ,id:1})
    
  response.json(blog)

})

blogRouter.get('/:id',  async(request, response, next) => {

  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
  
})

blogRouter.post('/',async (request, response, next) => {
  try {
    const { 
      title, 
      url ,
      author,
      id,
      //userId
    } = request.body; // Desestructura las propiedades


    // Verifica si el token está presente en la solicitud
    if (!request.token) {
      return response.status(401).json({ error: 'falta el token' });
    }
  
     let decodedToken;
    try {
      // Verifica y decodifica el token
      decodedToken = jwt.verify(request.token, process.env.SECRET);
    } catch (error) {
      return response.status(401).json({ error: 'token inválido' });
    }
    

    // Verifica si el token decodificado tiene un id válido
    if(!request.token || !decodedToken.id){
      return response.status(401).json({error: 'token missing or invalid'})
    }


    // Verifica si title y url están presentes en el cuerpo de la solicitud
    if (!title || !url) {
      // Si falta "title" o "url", responde con 400 Bad Request
      return response.status(400).json({ error: 'Title and URL are required' });
    }

      // Obtener el usuario desde el objeto de solicitud
    const user = request.user;

    // Crea un nuevo blog usando los datos de la solicitud
    const newBlog = new Blog ({
      title, 
      url ,
      author,
      id,
      user:user._id // Asigna el id del usuario al blog
    })

    // Guarda el nuevo blog en la base de datos
    const result = await newBlog.save();
 
    // Agrega el id del nuevo blog a la lista de blogs del usuario y guarda los cambios
    user.blog = user.blog.concat(result._id)
    await user.save()

    response.status(201).json(result);// Responde con el blog creado y un estado 201 (Created)
  } catch (error) {
    next(error);// Pasa cualquier error al siguiente middleware de manejo de errores
  }

})


blogRouter.delete('/:id',async (request, response, next) => {
  try {
    // Verifica si el token está presente en la solicitud
    if (!request.token) {
      return response.status(401).json({ error: 'falta el token' });
    }


    let decodedToken;
    try {
      // Verifica y decodifica el token
      decodedToken = jwt.verify(request.token, process.env.SECRET);
    } catch (error) {
      return response.status(401).json({ error: 'token inválido' });
    }



     // Verifica si el token decodificado tiene un id válido
     if (!decodedToken.id) {
      return response.status(401).json({ error: 'falta el token o es inválido' });
    }

    const user = request.user;

    // Busca el blog que se quiere eliminar
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: 'blog no encontrado' });
    }

    // Verifica si el usuario autenticado es el propietario del blog
    if (blog.user.toString() !== decodedToken.id) {
      return response.status(403).json({ error: 'no autorizado para eliminar este blog' });
    }



    // // Elimina el blog
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
    //
  } catch (error) {
    next(error);
  }

   
})


blogRouter.put('/:id',async (request, response, next) => {

  try {
    const body = request.body;

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    };

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }

})
     
module.exports = blogRouter