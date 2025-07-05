/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../index'); // Asegúrate de exportar tu app desde index.js
const jwt = require('jsonwebtoken');
const config = require('config');


describe('Auth Route', () => {
  test('Login exitoso con credenciales válidas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: '123456',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    // Opcional: Validar el token
    const decoded = jwt.verify(res.body.token, config.get('jwtSecret'));
    expect(decoded.user).toBe('admin');
  });

  test('Login fallido con credenciales incorrectas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe('Invalid credentials');
  });
});
