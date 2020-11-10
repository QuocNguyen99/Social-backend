const mongoose = require('mongoose');

const commentScheme = new mongoose.Schema({

})
const Comment = mongoose.model('comment', commentScheme);

function validate(cmt) {
    const scheme = Joi.object({
    })
    return scheme.validate(cmt);
}

exports.commentScheme = commentScheme;
exports.Comment = Comment;
exports.validate = validate;
