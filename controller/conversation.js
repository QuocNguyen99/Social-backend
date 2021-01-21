const { validate, Conversation } = require("../models/conversation");
const { validateMessage, Message } = require("../models/message");

exports.getListConversationByIdUser = async (req, res) => {
    try {
        const listConversation = await Conversation
            .find({ members: { $in: req.query.idUser } })
            .populate('members', 'displayName image')
            .populate({
                path: 'lastMessage',
                populate: [{ path: "sender" }]
            })
            .sort({ 'updatedAt': -1 })
        const listConversationAfterCheck = listConversation.filter(e => e.lastMessage !== undefined)
        res.send({
            error: false,
            data: listConversationAfterCheck
        })
    } catch (error) {
        console.log("Get list conversation", error.message);
    }
}

exports.createConversation = async (req, res) => {
    const tempConversation = req.body.conversation;
    const { error } = validate(tempConversation);
    if (error) return res.send({ error: true, message: 'Invalid conversation' })

    const result = await Conversation
        .findOne({ members: { $all: tempConversation.members } })
        .populate('members', 'displayName image')
    if (result) return res.send({
        error: false,
        data: result
    })

    let conversation = new Conversation({
        nameConversation: "",
        isGroup: false,
        members: tempConversation.members,
        // lastMessage: '',
        logo: "",
        imageInCoversation: [],
        createAt: Date.now(),
    })

    const conversationAfter = await conversation.save()
    const result2 = await Conversation
        .findById(conversationAfter._id)
        .populate('members', 'displayName image')
    res.send({
        error: false,
        data: result2
    })
}

// exports.getProfileConversation = async (req, res) => {
//     const idConversation = req.query.idConversation;
//     const conversation=await Conversation.findById(idConversation);
//     const dataReturn={
//         avata:
//     }

// }

exports.deleteConversation = async (req, res) => {
    const idConversation = req.query.idConversation;
    await Conversation.findByIdAndRemove(idConversation)

    res.send({
        error: false
    })

}
