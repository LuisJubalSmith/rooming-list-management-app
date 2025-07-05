/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../index');

describe('POST /api/import/data', () => {
  let token;

  beforeAll(async () => {
    // Login para obtener el token
    const res = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: '123456',
    });

    token = res.body.token;
  });

  it('Debe importar datos correctamente y responder con éxito', async () => {
    const res = await request(app)
      .post('/api/import/data')
      .set('x-auth-token', token); // ✅ enviamos el token

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data imported successfully');
  });
});


