const checkAuth = require('../utils/checkAuth');
const express = require('express');
const {
    createPost,
    getListPost,
    getPostByContent,
    editPost,
    deletePost,
    likePost,
    getPostById
} = require('../controller/post');
const route = express.Router();

route.get('/:page', getListPost);

route.get('/:content', getPostByContent);

route.get('/getpostbyid/:id', getPostById);

route.post('/', checkAuth, createPost);

route.put('/:id', checkAuth, editPost);

route.put('/like/:id', checkAuth, likePost);

route.delete('/:id', checkAuth, deletePost);

module.exports = route;