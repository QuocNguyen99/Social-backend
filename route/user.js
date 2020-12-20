const Joi = require('joi');
const express = require('express');
const {
    createUser,
    getUser,
    changeInforUser
} = require('../controller/user');
const checkAuth = require('../utils/checkAuth');
const route = express.Router();

route.get('/', getUser)

route.post('/', createUser);

route.put('/:id', checkAuth, changeInforUser);


module.exports = route;