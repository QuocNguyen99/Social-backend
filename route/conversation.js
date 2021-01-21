const checkAuth = require('../utils/checkAuth');
const express = require('express');
const {
    getListConversationByIdUser,
    createConversation,
    deleteConversation
} = require('../controller/conversation');
const route = express.Router();

route.get('/', getListConversationByIdUser);

route.post('/createConversation/', checkAuth, createConversation);

route.delete('/deleteConversation', checkAuth, deleteConversation);

module.exports = route;