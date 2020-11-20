const mongoose = require('mongoose');

const portMongo = process.env.MONGO_URL
const configMongo = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(portMongo, configMongo)
    .then(() => console.log('Connect with port', process.env.MONGO_URL))
    .catch(err => console.log('Fail connect db'))

