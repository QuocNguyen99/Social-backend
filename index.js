const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const User = require('./route/user');
const Auth = require('./route/auth');
const Post = require('./route/post');
const app = express();
require('./server');
require('dotenv').config();

var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/user', User);
app.use('/auth', Auth);
app.use('/posts', Post);


app.get('/', (req, res) => {
    res.send('Hello world');
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Connect with port', port);
})