const checkAuth = require('../utils/checkAuth');
const express = require('express');
const {
    getListComment,
    createComment
} = require('../controller/comment');
const route = express.Router();

route.get('/:id', getListComment);

route.post('/:id', checkAuth, createComment);

module.exports = route;