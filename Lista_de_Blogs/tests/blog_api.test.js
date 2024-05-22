
const { test, after,describe,it} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User= require('../models/User')
const Blog = require('../models/blogSchema')
const api = supertest(app)
const helper= require('../utils/test_helper')
//app.use(express.json())
//const Blog = require('../models/blogSchema')


beforeAll(async () => {
  await Blog.deleteMany({}); // Limpiar la base de datos antes de cada prueba

  const initialBlogs = [
    { title: 'First Blog', author: 'Author One', url: 'http://firstblog.com', likes: 1 },
    { title: 'Second Blog', author: 'Author Two', url: 'http://secondblog.com', likes: 2 }
  ];

  await Blog.insertMany(initialBlogs); // Insertar blogs iniciales para la prueba
});


describe('GET /api/blogs', () => {
  it('should return the correct amount of blog posts in JSON format', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(2); // Verifica que hay 2 blogs
  });
});

afterAll(async () => {
  await mongoose.connection.close(); // Cierra la conexión a la base de datos después de todas las pruebas
});

 

describe('BlogController', () => {
  it('should return posts with id property instead of _id', async () => {
     
    
    const blogAtStart = await api.get('/api/blogs')
    
    // Contar el número de blogs 
    //const blogsBefore = await Blog.countDocuments()
    
    // Seleccionar un blog de la lista de blogs 
    const blogToId = blogAtStart.body[0]



    // Realizar una solicitud HTTP para obtener la publicación
    const response = await api.get(`/api/blogs/${blogToId.id}`);

    // Verificar que la respuesta contiene la propiedad id en lugar de _id
    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('string');
    expect(response.body).not.toHaveProperty('_id');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});


describe('a valid blog can be added', () => {
  it('should create a new blog post via POST request', async () => {
    // Obtener el número total de blogs antes de la solicitud POST
    const blogsBefore = await Blog.countDocuments();

    // Datos de la nueva publicación de blog
    const newBlogData = {
      title: 'Título',
      author: 'autor',
      url: 'https://nueva-publicacion.com',
      likes: 789000
    };

    // Realizar una solicitud HTTP POST para crear una nueva publicación de blog
    const response = await api.post('/api/blogs').send(newBlogData);

    // Verificar que la respuesta tenga el código de estado 201 (Created)
    expect(response.status).toBe(201);

    // Verificar que la respuesta contenga la nueva publicación de blog
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newBlogData.title);
    expect(response.body.author).toBe(newBlogData.author);
    expect(response.body.url).toBe(newBlogData.url);
    expect(response.body.likes).toBe(newBlogData.likes);

    // Obtener el número total de blogs después de la solicitud POST
    const blogsAfter = await Blog.countDocuments();

    // Verificar que el número total de blogs se haya incrementado en uno
    expect(blogsAfter).toBe(blogsBefore + 1);
  });

  afterAll(async () => {
    await mongoose.connection.close()
  });
});



 
describe('like 0', () => {
  it('should set likes to 0 if missing in the request', async () => {
    // Datos de la nueva publicación de blog sin la propiedad 'likes'
    const newBlogData = {
      title: 'Título de la nueva publicación',
      author: 'Autor de la nueva publicación',
      url: 'https://nueva-publicacion.com'
    };

    // Realizar una solicitud HTTP POST para crear una nueva publicación de blog
    const response = await api.post('/api/blogs').send(newBlogData);

    // Verificar que la respuesta tenga el código de estado 201 (Created)
    expect(response.status).toBe(201);

    // Obtener la publicación de blog creada de la base de datos
    const createdBlog = await Blog.findById(response.body.id);

    // Verificar que la propiedad 'likes' de la publicación de blog sea 0
    expect(createdBlog.likes).toBe(0);
  })})


describe('estado 400 Bad Request', () => {
  it('responds with 400 Bad Request if title property is missing', async () => {
    // Realiza una solicitud POST al endpoint '/api/blogs' con un objeto que carece de la propiedad 'title'.
    const response = await api
      .post('/api/blogs')
      .send({ url: 'https://example.com' }) // Falta la propiedad "title"

    // Verifica que el estado de la respuesta sea 400 (Bad Request).
    expect(response.status).toBe(400)
    // Verifica que el cuerpo de la respuesta sea un objeto con la propiedad 'error' que indica que tanto el título como la URL son requeridos.
    expect(response.body).toEqual({ error: 'Title and URL are required' })
  })

  it('responds with 400 Bad Request if url property is missing', async () => {
    // Realiza una solicitud POST al endpoint '/api/blogs' con un objeto que carece de la propiedad 'url'.
    const response = await api
      .post('/api/blogs')
      .send({ title: 'Sample Blog' }) // Falta la propiedad "url"

    // Verifica que el estado de la respuesta sea 400 (Bad Request).
    expect(response.status).toBe(400)
    // Verifica que el cuerpo de la respuesta sea un objeto con la propiedad 'error' que indica que tanto el título como la URL son requeridos.
    expect(response.body).toEqual({ error: 'Title and URL are required' })
  })})


// Suite de pruebas para la eliminación de una nota
describe('eliminación de un blog', () => {
  test('sucede con el código de estado 204 si el ID es válido', async () => {
    // Obtener la lista de blogs al inicio de la prueba
    const blogAtStart = await api.get('/api/blogs')
    
    // Contar el número de blogs antes de la eliminación
    const blogsBefore = await Blog.countDocuments()
    
    // Seleccionar un blog de la lista de blogs para eliminar
    const blogToDelete = blogAtStart.body[1]
    console.log('holaaa', blogToDelete.id)

    // Realizar la solicitud DELETE para eliminar el blog seleccionado
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    // Contar el número de blogs después de la eliminación
    const blogsAfter = await Blog.countDocuments()

    // Verificar que el número de blogs después de la eliminación sea uno menos que antes,
    // lo que indica que un blog ha sido eliminado correctamente
    expect(blogsAfter).toBe(blogsBefore - 1)
  })}) 


describe('update like', () => {
  it('actualizar like', async () =>{

    // Realiza una solicitud GET a la API para obtener todos los blogs
    const blogAtStart =await api.get('/api/blogs')

    // Selecciona el segundo blog de la lista de blogs obtenidos
    const blogToUpdate = blogAtStart.body[1]

    // Define el nuevo valor de 'likes' que se usará para actualizar el blog
    const updatedLikes = 11;
 
    // Realiza una solicitud PUT a la API para actualizar el blog seleccionado
    // Envia el nuevo valor de 'likes' en el cuerpo de la solicitud
   const response= await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: updatedLikes }) 

    console.log('responseeeeeeeeeee', response.body.likes)

    // Verifica que el estado de la respuesta sea 200 (solicitud exitosa)
    assert.strictEqual(response.status, 200); // Verifica que la solicitud haya sido exitosa

    // Verifica que el valor de 'likes' en la respuesta sea igual al valor actualizado
    assert.strictEqual(response.body.likes, updatedLikes);
  })


   
})


describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid and user is authorized', async () => {
    const { token } = await helper.getTokenForTestUser(); // Obtiene un token para el usuario de prueba
    const blogsAtStart = await helper.blogsInDb(); // Obtiene los blogs iniciales de la base de datos
    const blogToDelete = blogsAtStart[0]; // Selecciona el primer blog para eliminar

    await api
      .delete(`/api/blogs/${blogToDelete.id}`) // Realiza una solicitud DELETE para eliminar el blog
      .set('Authorization', `Bearer ${token}`) // Establece el encabezado de autorización con el token
      .expect(204); // Espera un código de estado 204 (sin contenido)

    const blogsAtEnd = await helper.blogsInDb(); // Obtiene los blogs restantes de la base de datos
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1); // Verifica que el número de blogs haya disminuido en uno

    const contents = blogsAtEnd.map(r => r.title);
    expect(contents).not.toContain(blogToDelete.title); // Verifica que el título del blog eliminado no esté en los blogs restantes
  });

  test('fails with status code 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb(); // Obtiene los blogs iniciales de la base de datos
    const blogToDelete = blogsAtStart[0]; // Selecciona el primer blog para eliminar

    await api
      .delete(`/api/blogs/${blogToDelete.id}`) // Realiza una solicitud DELETE para eliminar el blog
      .expect(401); // Espera un código de estado 401 (no autorizado) ya que no se proporciona el token

    const blogsAtEnd = await helper.blogsInDb(); // Obtiene los blogs restantes de la base de datos
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length); // Verifica que el número de blogs no haya cambiado
  });

  test('fails with status code 403 if user is not the owner of the blog', async () => {
    const { token } = await helper.getTokenForTestUser(); // Obtiene un token para el usuario de prueba
    const anotherUser = new User({ username: 'anotheruser', password: 'password' });
    await anotherUser.save(); // Crea y guarda otro usuario en la base de datos

    const anotherUserToken = jwt.sign({ username: anotherUser.username, id: anotherUser._id }, process.env.SECRET); // Crea un token para el otro usuario

    const blogsAtStart = await helper.blogsInDb(); // Obtiene los blogs iniciales de la base de datos
    const blogToDelete = blogsAtStart[0]; // Selecciona el primer blog para eliminar

    await api
      .delete(`/api/blogs/${blogToDelete.id}`) // Realiza una solicitud DELETE para eliminar el blog
      .set('Authorization', `Bearer ${anotherUserToken}`) // Establece el encabezado de autorización con el token del otro usuario
      .expect(403); // Espera un código de estado 403 (prohibido) ya que el usuario no es el propietario del blog

    const blogsAtEnd = await helper.blogsInDb(); // Obtiene los blogs restantes de la base de datos
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length); // Verifica que el número de blogs no haya cambiado
  });
});



after(async () => {
  await mongoose.connection.close()
  //server.close()
})
// npm run test -- --test-only

//"test": "cross-env  NODE_ENV=test node --test",