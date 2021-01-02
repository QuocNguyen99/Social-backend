const { validate, Conversation } = require("../models/conversation");
const { validateMessage, Message } = require("../models/message");

exports.getListConversationByIdUser = async (req, res) => {
    try {
        const listConversation = Conversation
            .find({ members: { $in: req.data.idUser } })
            .populate('lastMessage', 'sender content')
            .populate('members', 'displayName image')
            .sort({ 'createAt': - 1 })
        res.send({
            error: false,
            data: listConversation
        })
    } catch (error) {
        console.log("Get list conversation", error.message);
    }
}

exports.createConversation = async (req, res) => {
    const tempConversation = req.data.conversation;
    const { error } = validate(tempConversation);
    if (error) return res.send({ error: true, message: 'invalid conversation' })
    let conversation = new Conversation({
        nameConversation: "",
        isGroup: false,
        members: tempConversation.members,
        lastMessage: "",
        logo: "",
        imageInCoversation: [],
        createAt: Date.now(),
    })

    const conversationAfterCreate = await conversation.save();

    const tempMessage = req.data.message;
    const { error } = validateMessage(tempMessage);
    if (error) return res.send({ error: true, message: 'invalid message' })
    const message = new Message({
        sender: tempMessage,
        content: tempMessage.content,
        conversation: "",
        listImage: [],
        listSeen: [],
        createAt: Date.now()
    })

    const messageAfterUpdate = await message.save().catch(error => res.send({ error: true, message: error.message }));

    await Conversation.findByIdAndUpdate(conversationAfterCreate._id, { lastMessage: messageAfterUpdate._id });
    await Message.findByIdAndUpdate(messageAfterUpdate._id, { conversation: conversationAfterCreate._id })
    res.send({
        error: false,
    })
}
