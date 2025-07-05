/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');
const config = require('config');

describe('Rooming List Routes', () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ username: 'admin' }, config.get('jwtSecret'), {
      expiresIn: '1h',
    });
  });

  test('GET /api/rooming-lists SIN token debe fallar', async () => {
    const res = await request(app).get('/api/rooming-lists');

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe('No token, authorization denied');
  });

  test('GET /api/rooming-lists CON token debe tener éxito', async () => {
    const res = await request(app)
      .get('/api/rooming-lists')
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
