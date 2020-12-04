const { validate, Comment } = require("../models/comment");
const { Post } = require("../models/post");

exports.getListComment = async (req, res) => {
    const post = await Post.findById(req.body.id);
    if (!post) return res.status(404).send({ error: true });

    const comments = await Comment.find({ idPost: req.body.id })
        .populate('author', ' displayName image')
        .sort({ 'createdAt': - 1 })
    res.send({
        error: false,
        data: comments
    })
} 