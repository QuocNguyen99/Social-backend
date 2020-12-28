const Joi = require('joi');
const express = require('express');
const {
    createUser,
    getUser,
    changeInforUser,
    changeAvataUser,
    changeImageCoverUser,
    changePassword
} = require('../controller/user');
const checkAuth = require('../utils/checkAuth');
const route = express.Router();

route.get('/', getUser)

route.post('/', createUser);

route.put('/:id', checkAuth, changeInforUser);

route.put('/updateAvata/:id', checkAuth, changeAvataUser);

route.post('/updateImageCover/:id', checkAuth, changeImageCoverUser);

route.post('/updatepassword/:id', checkAuth, changePassword);


module.exports = route;