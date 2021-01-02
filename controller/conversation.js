const { validate, Conversation } = require("../models/conversation");
const { validateMessage, Message } = require("../models/message");

exports.getListConversationByIdUser = async (req, res) => {
    try {
        const listConversation = await Conversation
            .find({ members: { $in: req.body.idUser } })
            .populate('lastMessage', 'sender content')
            .populate('members', 'displayName image')
            .sort({ 'createAt': - 1 })
        console.log("Data", listConversation);
        res.send({
            error: false,
            data: listConversation
        })
    } catch (error) {
        console.log("Get list conversation", error.message);
    }
}

exports.createConversation = async (req, res) => {
    const tempConversation = req.body.conversation;
    const tempMessage = req.body.message;
    const { error } = validate(tempConversation);
    if (error) return res.send({ error: true, message: 'invalid conversation' })
    let conversation = new Conversation({
        nameConversation: "",
        isGroup: false,
        members: tempConversation.members,
        logo: "",
        imageInCoversation: [],
        createAt: Date.now(),
    })

    const conversationAfterCreate = await conversation.save()

    const message = new Message({
        sender: tempMessage.sender,
        content: tempMessage.content,
        listImage: [],
        listSeen: [],
        createAt: Date.now()
    })

    const messageAfterUpdate = await message.save()
    await Conversation.findByIdAndUpdate(conversationAfterCreate._id, { lastMessage: messageAfterUpdate._id });
    await Message.findByIdAndUpdate(messageAfterUpdate._id, { conversation: conversationAfterCreate._id })
    res.send({
        error: false,
    })
}
