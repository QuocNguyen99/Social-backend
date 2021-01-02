const checkAuth = require('../utils/checkAuth');
const express = require('express');
const {
    getListConversationByIdUser,
    createConversation
} = require('../controller/conversation');
const route = express.Router();

route.get('/', getListConversationByIdUser);

route.post('/createConversation/', createConversation);

module.exports = route;