const mongoose = require('mongoose');
const Joi = require('joi');

const conversationScheme = new mongoose.Schema({
    nameConversation: String,
    isGroup: {
        type: Boolean,
        default: false
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    logo: {
        type: String,
        default: "https://res.cloudinary.com/dp2rat4ch/image/upload/v1609501755/group-default-avatar_chyxjl.png"
    },
    imageInCoversation: [
        {
            type: String
        }
    ],
    createAt: Date
})

const Conversation = mongoose.model("Conversation", conversationScheme);

function validate(conversation) {
    const scheme = Joi.object({
        nameConversation: Joi.string(),
        isGroup: Joi.boolean(),
        members: Joi.array().items(Joi.objectId()),
        lastMessage: Joi.objectId(),
        logo: Joi.string(),
        imageInCoversation: Joi.array().items(Joi.string()),
        createAt: Joi.date()
    })
    return scheme.validate(conversation);
}

exports.conversationScheme = conversationScheme;
exports.Conversation = Conversation;
exports.validate = validate;