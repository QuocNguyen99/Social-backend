const checkAuth = require('../utils/checkAuth');
const express = require('express');
const {
    createPost,
    getListPost,
    getPostByContent,
    editPost,
    deletePost
} = require('../controller/post');
const route = express.Router();

route.get('/', getListPost);

route.get('/content', getPostByContent);

route.post('/', checkAuth, createPost);

route.put('/id', checkAuth, editPost);

route.delete('/id', checkAuth, deletePost);

module.exports = route;