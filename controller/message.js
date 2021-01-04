const { validate, Conversation } = require("../models/conversation");
const { validateMessage, Message } = require("../models/message");

exports.sendMessage = async (req, res) => {
    const idConversation = req.body.idConversation;
    const tempMessage = req.body.message;
    const { error } = validateMessage(tempMessage);
    if (error) return res.send({ error: true, message: error })
    const message = new Message({
        sender: tempMessage.sender,
        content: tempMessage.content,
        conversation: idConversation,
        listImage: [],
        listSeen: [],
        createAt: Date.now()
    })

    const messageAfterUpdate = await message.save().catch(error => res.send({ error: true, message: error.message }));

    await Conversation.findByIdAndUpdate(idConversation, { lastMessage: messageAfterUpdate._id }).catch(error => console.log('ERROR', error.message));
    res.send({
        error: false,
    })
}

exports.getListMessage = async (req, res) => {
    try {
        const messages = await Message.find({ conversation: req.query.idConversation }).populate('sender', 'displayName image').sort({ 'createAt': -1 })
        res.send({ error: false, data: messages })
    } catch (error) {
        res.send({ error: true, message: error.message })
    }
}