const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const User = require('./route/user');
const Auth = require('./route/auth');
const Posts = require('./route/post');
const Comments = require('./route/comment');
const { Post } = require('./models/post');
const { Comment } = require('./models/comment');

require('./server');
require('dotenv').config();

io.on('connection', (socket) => {
    socket.on('CLIENT-SEND-COUNT-LIKE', async (data) => {
        const post = await Post.findById(data);
        io.emit('SERVER-SEND-COUNT-LIKE', { id: post._id, count: post.likePost.length })
    })
    socket.on('CLIENT-SEND-COUNT-COMMENT', async (data) => {
        const comments = await Comment.find({ idPost: data });
        io.emit('SERVER-SEND-COUNT-COMMENT', { id: data, count: comments.length })
    })
})

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/user', User);
app.use('/auth', Auth);
app.use('/posts', Posts);
app.use('/comment', Comments);


app.get('/', (req, res) => {
    res.send('Hello world');
})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('Connect with port', port);
})