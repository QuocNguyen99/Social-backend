const Joi = require('joi');
const express = require('express');
const { createUser, getUser } = require('../controller/user');
const route = express.Router();

route.get('/', getUser)

route.post('/', createUser);


module.exports = route;