const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const portMongo = process.env.MONGO_URL
const configMongo = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(portMongo, configMongo)
    .then(() => console.log('Connect with port', process.env.MONGO_URL))
    .catch(err => console.log('Fail connect db'))

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});