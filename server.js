const mongoose = require('mongoose');

const portMongo = process.env.MONGO_URL
const configMongo = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

mongoose.connect(portMongo, configMongo)
    .then(() => console.log('Connect with Mongo'))
    .catch(err => console.log('Fail connect db'))

