const bcrypt = require('bcrypt');
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

// exports.getUserByName = async (req, res) => {
//     const name = req.query.name.trim();
//     if (!name) return res.status(400).send('Enter Something');

//     const users = await User
//         .find({ displayName: { $regex: new RegExp(name.toLowerCase(), "i") } })
//     res.send({
//         error: false,
//         data: {
//             users: users
//         }
//     });
// }