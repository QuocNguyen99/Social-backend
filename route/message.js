const checkAuth = require('../utils/checkAuth');
const express = require('express');
const {
    sendMessage, getListMessage
} = require('../controller/message');
const route = express.Router();

route.get('/', getListMessage);

route.post('/', sendMessage);

module.exports = route;