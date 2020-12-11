const checkAuth = require('../utils/checkAuth');
const express = require('express');
const {
    getListComment,
    createComment,
    createCommentReply,
    getListReply,
    getReplyLength
} = require('../controller/comment');
const route = express.Router();

route.get('/:id', getListComment);

route.get('/reply/:id', getListReply);

route.get('/replylength/:id', getReplyLength);

route.post('/:id', checkAuth, createComment);

route.post('/reply/:id', checkAuth, createCommentReply);


module.exports = route;