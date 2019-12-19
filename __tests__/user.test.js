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
    await User.create({ 
      email: 'something@something.com', 
      password: 'badpass' 
    });
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'something@something.com', 
        password: 'badpass'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'something@something.com',
          __v: 0
        });
      });
  });

  it('returns an error if login with wrong email', async() => {
    await User.create({ 
      email: 'findme@gmail.com', 
      password: 'badpass' 
    });
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'findme@gmail.edu', 
        password: 'badpass'
      })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Email/Password',
          status: 401
        });
      });
  });

  it('returns an error if login with wrong password', async() => {
    await User.create({ 
      email: 'me@me.com', 
      password: 'badpass' 
    });
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'me@me.com', 
        password: 'goodpass'
      })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Email/Password',
          status: 401
        });
      });
  });

  it('has a cookie', async() => {
    await User.create({
      email: 'Cookie@yum.com',
      password: 'chocolateChip'
    });
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'Cookie@yum.com', 
        password: 'chocolateChip'
      })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.any(String));
      });
  });
});
