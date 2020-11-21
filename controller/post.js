const { cloudinary } = require('../utils/cloudinary')
const { validate, Post, validateEdit } = require("../models/post");
const Joi = require('joi');
const { User } = require("../models/user");

exports.getListPost = async (req, res) => {
    const posts = await Post.find()
        .populate('author', ' displayName image')
        //.populate('comment')
        .sort('createAt');
    res.send(posts);
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
            return res.status(409).send('Error');
        }
    }
    let postValidate = {
        content: req.body.content,
        image: listImages,
        author: req.body.author,
        comment: req.body.comment,
        likeUser: req.body.likeUser
    }

    const { error } = validate(postValidate);
    if (error) return res.status(450).send(error.details[0].message);

    const user = await User.findById(req.body.author);
    if (!user) return res.status(404).send(`User don't exits`);

    let post = new Post({
        content: req.body.content,
        image: listImages,
        author: req.body.author,
        comment: req.body.comment,
        likeUser: req.body.likeUser
    })
    await post.save();
    res.send('Success')
}

exports.editPost = async (req, res) => {
    const { error } = validateEdit(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const post = await Post.findByIdAndUpdate(req.params.id, {
        content: req.body.content,
        image: req.body.image,
        comment: req.body.comment,
        likeUser: req.body.likeUser,
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