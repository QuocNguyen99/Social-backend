const { cloudinary } = require('../utils/cloudinary')
const { validate, Post, validateEdit } = require("../models/post");
const { User } = require("../models/user");

exports.getListPost = async (req, res) => {
    try {
        // console.log('123123');
        const page = req.query.page;
        const pageSize = 5;
        await Post.find()
            .populate('author', ' displayName image')
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ 'createAt': -1 })
            .then((posts) => {
                res.send({
                    error: 'false',
                    data: posts
                });
            })
            .catch((err) => { res.status(500).send({ err: true, message: err.message }) })
    } catch (err) {
        res.status(500).send({ err: true, message: err.message })
    }
}

exports.getPostByContent = async (req, res) => {
    const content = req.query.content.trim();
    if (!content) return res.status(400).send('Enter Something');
    const posts = await Post
        .find({ content: { $regex: new RegExp(content.toLowerCase(), "i") } })
        .populate('author', 'displayName image')
        .sort({ 'createAt': -1 });

    const users = await User
        .find({ displayName: { $regex: new RegExp(content.toLowerCase(), "i") } })

    res.send({
        error: false,
        data: {
            posts: posts,
            users: users
        }
    });
}

exports.getPostById = async (req, res) => {
    const post = await Post
        .findById(req.query.id)
        .populate('author', 'displayName image')
    if (!post) return res.status(400).send({ error: true })
    res.send({
        error: false,
        data: post
    });
}

exports.getlistPostByIdUser = async (req, res) => {
    console.log(req.query.idUser);
    const posts = await Post
        .find({ author: req.query.idUser })
        .populate('author', 'displayName image')
        .sort({ 'createAt': -1 })
        .exec()
    if (!posts) return res.status(400).send({ error: true })
    console.log(posts.length);
    res.send({
        error: false,
        data: posts
    });
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
        likePost: req.body.likePost,

    });
    if (error) return res.send({ error: true })
    const user = await User.findById(req.body.author);
    if (!user) return res.send({ error: true })

    let post = new Post({
        content: req.body.content,
        image: listImages,
        author: req.body.author,
        likePost: req.body.likePost,
        createAt: Date.now()
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

    const post = await Post.findByIdAndUpdate(req.query.id, {
        content: req.body.content,
        image: listImages,
        modifyAt: Date.now()
    }, { new: true })
    if (!post) return res.status(404).send('Nothing with id');

    res.send({ error: false });
}

exports.deletePost = async (req, res) => {
    if (req.body.author !== req.body.idUser) return res.send(404).send('Do not owner post')
    await Post.findByIdAndDelete(req.query.id)
    res.send({
        error: false
    });
}

exports.likePost = async (req, res) => {
    const user = await User.findById(req.body.idUser);
    if (!user) return res.send({ error: true })

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