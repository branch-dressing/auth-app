require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can signup a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'joel@joel.com', password: 'pass1234' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'joel@joel.com',
          __v: 0
        });
      });
  });

  it('can login a user', async() => {
    const user = User.create({ 
      email: 'findme@gmail.com', 
      password: 'badpass' 
    });
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'findme@gmail.com', 
        password: 'badpass'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'findme@gmail.com',
          __v: 0
        });
      });
  });
});
