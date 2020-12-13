const checkAuth = require('../utils/checkAuth');
const express = require('express');
const {
    createPost,
    getListPost,
    getPostByContent,
    editPost,
    deletePost,
    likePost,
    getPostById,
    getlistPostByIdUser,
} = require('../controller/post');
const route = express.Router();

route.get('/:page', getListPost);

route.get('/search/:content', getPostByContent);

route.get('/list/:id', getlistPostByIdUser);

route.get('/getpostbyid/:id', getPostById);

route.post('/', checkAuth, createPost);

route.put('/:id', checkAuth, editPost);

route.put('/like/:id', checkAuth, likePost);

route.delete('/:id', checkAuth, deletePost);

module.exports = route;