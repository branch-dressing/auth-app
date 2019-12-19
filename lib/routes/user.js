const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .post('/auth/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => res.send(user))
      .catch(next);
  })
  .post('/auth/login', (req, res, next) => {
    User
      .authenticate(req.body)
      .then(user => res.send(user))
      .catch(next);
  });
