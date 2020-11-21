const mongoose = require('mongoose');
const Joi = require('joi');

const postScheme = new mongoose.Schema({
    content: String,
    image: [{
        type: String
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likeUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createAt: {
        type: Date,
        default: Date.now()
    },
    modifyAt: Date,
})

const Post = mongoose.model('Post', postScheme);

function validate(post) {
    const scheme = Joi.object({
        content: Joi.string().allow(''),
        image: Joi.array().items(Joi.string()),
        author: Joi.objectId().required(),
        comment: Joi.array().items(Joi.objectId),
        likeUser: Joi.array().items(Joi.objectId),
        createAt: Joi.date(),
        modifyAt: Joi.date()
    })
    console.log('run');
    return scheme.validate(post);
}


function validateEdit(post) {
    const scheme = Joi.object({
        content: Joi.string(),
        image: Joi.array().items(Joi.string()),
        comment: Joi.array().items(Joi.objectId),
        likeUser: Joi.array().items(Joi.objectId),
        createAt: Joi.date(),
        modifyAt: Joi.date()
    })
    return scheme.validate(post);
}
exports.postScheme = postScheme;
exports.Post = Post;
exports.validate = validate;
exports.validateEdit = validateEdit;
