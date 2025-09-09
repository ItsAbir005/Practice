const request = require('supertest');
const { app } = require('./server');

test('POST /validate-email with valid email', async () => {
  const res = await request(app)
    .post('/validate-email')
    .send({ email: 'hello@example.com' });
  
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ email: 'hello@example.com', valid: true });
});

test('POST /validate-email with invalid email', async () => {
  const res = await request(app)
    .post('/validate-email')
    .send({ email: 'hello' });
  
  expect(res.statusCode).toBe(200);
  expect(res.body.valid).toBe(false);
});

test('POST /validate-email without email', async () => {
  const res = await request(app)
    .post('/validate-email')
    .send({});
  
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('Email is required');
});
