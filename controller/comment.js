const { validate, Comment } = require("../models/comment");
const { Post } = require("../models/post");

exports.getListComment = async (req, res) => {
    const comments = await Comment.find({ idPost: req.query.id })
        .populate('author', ' displayName image')
        .sort({ 'createAt': - 1 })
    const commentFillter = comments.filter(e => !e.idComment)
    res.send({
        error: false,
        data: commentFillter
    })
}

exports.getListReply = async (req, res) => {
    const comments = await Comment.find({ idComment: req.query.idCmt })
        .populate('author', ' displayName image')
        .sort({ 'createAt': - 1 })
    res.send({
        error: false,
        data: comments
    })
}

exports.createComment = async (req, res) => {
    const post = await Post.findById(req.query.id);
    if (!post) return res.status(404).send({ error: true });

    const { error } = validate(req.body.comment);
    if (error) return res.status(400).send(error.details[0].message)
    const commentTemp = req.body.comment;
    const comment = new Comment({
        content: commentTemp.content,
        idPost: commentTemp.idPost,
        author: commentTemp.author,
        createAt: Date.now(),
    })
    await comment.save();
    res.send({
        error: false
    })
}

exports.createCommentReply = async (req, res) => {
    const commentCheck = await Comment.findById(req.query.idCmt);
    if (!commentCheck) return res.status(404).send({ error: true });

    const { error } = validate(req.body.comment);
    if (error) return res.status(400).send(error.details[0].message)
    const commentTemp = req.body.comment;
    const comment = new Comment({
        content: commentTemp.content,
        idPost: commentTemp.idPost,
        idComment: commentTemp.idComment,
        author: commentTemp.author,
        createAt: Date.now(),
    })
    await comment.save();
    res.send({
        error: false
    })
} 