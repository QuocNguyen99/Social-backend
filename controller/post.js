const { cloudinary } = require('../utils/cloudinary')
const { validate, Post, validateEdit } = require("../models/post");
const Joi = require('joi');
const { User } = require("../models/user");

exports.getListPost = async (req, res) => {
    const page = req.query.page;
    const posts = await Post.find()
        .populate('author', ' displayName image')
        //.populate('comment')
        .limit(page * 10)
        .sort({ 'createAt': -1 });
    res.send({
        error: false,
        data: posts
    });
}

exports.getPostByContent = async (req, res) => {
    const content = req.params.content.trim();
    if (!content) return res.status(400).send('Enter Something');
    const posts = await Post
        .find({ content: /.*content.*/i })
        .populate('author', 'displayName image')
        // .populate('comment')
        .sort('createAt');
    res.send(posts);
}

exports.createPost = async (req, res) => {
    let listImages = []
    if (req.body.image.length > 0) {
        try {
            const { image } = req.body;
            for (var item of image) {
                const uploadRes = await cloudinary.uploader
                    .upload(item, {
                        upload_preset: 'post_images'
                    })
                listImages.push(uploadRes.url)
            }

        } catch (error) {
            console.log('Error', error.message);
            return res.send({ error: true })
        }
    }

    const { error } = validate({
        content: req.body.content,
        image: listImages,
        author: req.body.author,
        comment: req.body.comment,
        likePost: req.body.likePost
    });
    if (error) return res.send({ error: true })

    const user = await User.findById(req.body.author);
    if (!user) return res.send({ error: true })

    let post = new Post({
        content: req.body.content,
        image: listImages,
        author: req.body.author,
        comment: req.body.comment,
        likePost: req.body.likePost
    })
    await post.save();
    res.send({
        error: false,
        data: post
    })
}

exports.editPost = async (req, res) => {
    const { error } = validateEdit(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const post = await Post.findByIdAndUpdate(req.params.id, {
        content: req.body.content,
        image: req.body.image,
        modifyAt: Date.now()
    }, { new: true })
    if (!post) return res.status(404).send('Nothing with id');

    res.send(post);
}

exports.deletePost = async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).send('Nothing with id');
    res.send(post);
}

exports.likePost = async (req, res) => {
    const user = await User.findById(req.body.idUser);
    if (!user) res.send({ error: true })

    let post = await Post.findById(req.query.id);
    if (!post) return res.send({ error: true })

    const result = post.likePost.filter(e => e == req.body.idUser);
    if (result.length > 0) {
        await post.likePost.pull(req.body.idUser)
    } else {
        await post.likePost.push(req.body.idUser);
    }
    await post.save();
    res.send({ error: false })
}