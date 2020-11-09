const mongoose = require('mongoose');

const portMongo = 'mongodb://127.0.0.1:27017/SocialApp'
const configMongo = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(portMongo, configMongo)
    .then(() => console.log('Connected mongodb'))
    .catch(err => console.log('Fail connect db'))