const Joi = require('joi');
const express = require('express');
const { login } = require('../controller/auth');
const route = express.Router();

route.post('/', login);

module.exports = route;