const checkAuth = require('../utils/checkAuth');
const express = require('express');
const {
    getListConversationByIdUser
} = require('../controller/conversation');
const route = express.Router();

route.get('/', getListConversationByIdUser);

module.exports = route;