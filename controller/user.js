const bcrypt = require('bcrypt');
const { cloudinary } = require('../utils/cloudinary')
const { User, validate } = require('../models/user');

exports.createUser = async (req, res) => {
    const email = req.body.email.toLowerCase()
    const { error } = validate(req.body);
    if (error) return res.send({ error: true })

    let user = await User.findOne({ email: email })
    if (user) return res.send({ error: true, type: 'User already exists' })
    user = new User({
        email: email,
        password: req.body.password,
        displayName: req.body.displayName,
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.send({ error: false });
}

exports.getUser = async (req, res) => {
    const user = await User
        .findById(req.query.idUser)
    if (!user) return res.status(404).send({ error: true, message: 'Not found User' })
    const userReturn = {
        birthDay: user.birthDay,
        image: user.image,
        imageCover: user.imageCover,
        bio: user.bio,
        studyAt: user.studyAt,
        workAt: user.workAt,
        _id: user._id,
        email: user.email,
        displayName: user.displayName
    }
    res.send({
        error: false,
        data: userReturn
    })
}

exports.changeInforUser = async (req, res) => {
    const user = User.findById(req.query.idUser);
    if (!user) return res.status(404).send({ error: true, message: 'User not exits' })
    const userUpdate = req.body.userUpdate;
    await User.findByIdAndUpdate(req.query.idUser, { $set: userUpdate })
    res.send({
        error: false
    })
}

exports.changeAvataUser = async (req, res) => {
    let user = User.findById(req.query.idUser);
    if (!user) return res.status(404).send({ error: true, message: 'User not exits' })
    let avataUpdate = req.body.avataUpdate;
    let avataCurrent = req.body.avataCurrent;
    try {

        if (!avataUpdate) {
            await User.findByIdAndUpdate({ _id: req.query.idUser }, { $set: { image: avataCurrent } })
            console.log('1');
            // user.image = avataCurrent;
            // await user.save();

            res.send({
                error: false
            })
        } else {
            const uploadRes = await cloudinary.uploader
                .upload(avataUpdate, {
                    upload_preset: 'post_images'
                })
            await User.findByIdAndUpdate({ _id: req.query.idUser }, { $set: { image: uploadRes.url } })
            // user.image = uploadRes.url
            // await user.save()
            console.log('2');
            res.send({
                error: false
            })
        }

    } catch (error) {
        console.log('Error', error.message);
        return res.send({ error: true })
    }
}
