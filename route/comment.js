const checkAuth = require('../utils/checkAuth');
const express = require('express');
const {
    getListComment
} = require('../controller/comment');
const route = express.Router();

route.get('/', getListComment);

module.exports = route;