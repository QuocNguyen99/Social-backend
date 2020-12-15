const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userScheme = new mongoose.Schema({
    email: {
        type: String,
        minlength: 5,
        required: true,
        unique: true
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
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    workAt: {
        type: String,
        default: ""
    },
    studyAt: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/dp2rat4ch/image/upload/v1608031982/avataDefault_obmgcb.gif"
    },
    imageCover: {
        type: String,
        default: "https://res.cloudinary.com/dp2rat4ch/image/upload/v1608033503/imagecover_fd4dcs.png"
    }
})

userScheme.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        displayName: this.displayName,
        image: this.image,
        imageCover: this.imageCover
    },
        process.env.SECRET_KEY)
    return token;
}

const User = mongoose.model('User', userScheme);

function validate(user) {
    const scheme = Joi.object({
        email: Joi.string().required().min(5).email(),
        password: Joi.string().required().min(5).max(50),
        displayName: Joi.string().required().min(1).max(50),
        birthDay: Joi.string(),
        bio: Joi.string(),
        workAt: Joi.string(),
        studyAt: Joi.string(),
        image: Joi.string(),
        imageCover: Joi.string()
    })
    return scheme.validate(user);
}

exports.userScheme = userScheme;
exports.User = User;
exports.validate = validate;