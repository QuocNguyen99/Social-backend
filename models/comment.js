const mongoose = require('mongoose');

const commentScheme = new mongoose.Schema({
    content: String,
    imageCmt: [{
        type: String
    }],
    idPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createAt: {
        type: Date
    },
    modifyAt: {
        type: Date
    },
})
const Comment = mongoose.model('Comment', commentScheme);

function validate(cmt) {
    const scheme = Joi.object({
        content: Joi.string().allow(''),
        imageCmt: Joi.array().items(Joi.string()),
        author: Joi.objectId().required(),
        idPost: Joi.objectId().required(),
        createAt: Joi.date(),
        modifyAt: Joi.date()
    })
    return scheme.validate(cmt);
}

exports.commentScheme = commentScheme;
exports.Comment = Comment;
exports.validate = validate;
