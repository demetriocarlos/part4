
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
//const User = require('../models/User')
const User = require('../models/User')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({});
});

describe('creating a new user', () => {
    test('fails with proper statuscode and message if username is not provided', async () => {
      const newUser = {
        name: 'sofia',
        password: '4321'
      };
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);
  
      expect(result.body.error).toContain('El nombre de usuario y la contraseña son obligatorios');
    });
  
    test('fails with proper statuscode and message if password is not provided', async () => {
      const newUser = {
        username: 'karla',
        name: 'sofia'
      };
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);
  
      expect(result.body.error).toContain('El nombre de usuario y la contraseña son obligatorios');
    });
  
    test('fails with proper statuscode and message if username or password is less than 3 characters', async () => {
      const newUser = {
        username: 'ka',
        name: 'sofia',
        password: '43'
      };
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);
  
      expect(result.body.error).toContain('El nombre de usuario y la contraseña deben tener al menos 3 caracteres');
    });
  
    
    test('fails with proper statuscode and message if username is not unique', async () => {
      const newUser = {
        username: 'karla',
        name: 'sofia',
        password: '4321'
      };
  
      await api.post('/api/users').send(newUser);
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);
  
      expect(result.body.error).toContain('El nombre de usuario ya está en uso');
    });
  
    

  });