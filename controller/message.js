const { validate, Conversation } = require("../models/conversation");
const { validateMessage, Message } = require("../models/message");

exports.sendMessage = async (idConversation, tempMessage) => {

    const { error } = validateMessage(tempMessage);
    if (error) return ({ error: true, message: error })
    const message = new Message({
        sender: tempMessage.sender,
        content: tempMessage.content,
        conversation: idConversation,
        listImage: [],
        listSeen: [],
        createAt: Date.now()
    })

    const messageAfterUpdate = await message.save().catch(error => { return ({ error: true, message: error.message }) });

    const messageSendClient = await Message.findById(messageAfterUpdate._id).populate('sender', 'displayName image').sort({ 'createAt': -1 })

    await Conversation.findByIdAndUpdate(idConversation, { lastMessage: messageAfterUpdate._id }).catch(error => { return { error: true, message: error.message.details[0] } });

    return {
        messageSendClient
    }
}

exports.getListMessage = async (req, res) => {
    try {
        const page = req.query.page;
        const pageSize = 20;
        const messages = await Message
            .find({ conversation: req.query.idConversation })
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .populate('sender', 'displayName image')
            .sort({ 'createAt': -1 })
        res.send({ error: false, data: messages })
    } catch (error) {
        res.send({ error: true, message: error.message })
    }
}