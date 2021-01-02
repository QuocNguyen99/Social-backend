const mongoose = require('mongoose');
const Joi = require('joi');

const schemeMessage = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    listImage: [
        {
            type: String
        }
    ],
    listSeen: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createAt: Date
})

const Message = mongoose.model("Message", schemeMessage);

function validate(message) {
    const scheme = Joi.object({
        sender: Joi.objectId().require(),
        content: Joi.string(),
        conversation: Joi.objectId(),
        listImage: Joi.array().items(Joi.string()),
        listSeen: Joi.array().items(Joi.objectId()),
        createAt: Joi.date().require()
    })
    return scheme.validate(message);
}

exports.schemeMessage = schemeMessage;
exports.Message = Message;
exports.validateMessage = validate;