const Joi = require('joi');
const mongoose = require('mongoose');
const Joi = require('joi');

const userScheme = new mongoose.Schema({
    email: {
        type: String,
        minlength: 5,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024
    },
    displayName: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true
    },
    birthDay: {
        type: Date,
    }
})

const User = mongoose.model('User', userScheme);
function validate(user) {
    const scheme = Joi.object({
        email: Joi.string().required().min(5).email(),
        password: Joi.string().required().min(5).max(50),
        displayName: Joi.string().required().min(1).max(50),
        birthDay: Joi.date()
    })
    return scheme.validate(user);
}

exports.userScheme = userScheme;
exports.User = User;
exports.validate = validate;