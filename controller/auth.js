const bcrypt = require('bcrypt');
const { func } = require('joi');
const Joi = require('joi');

const { User } = require('../models/user');

exports.login = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send({
        error: true,
        data: {}
    });

    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) return res.send({
        error: true, data: {}
    });

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.send({
        error: true, data: {}
    });

    const token = user.generateAuthToken();

    res.send({
        error: false,
        data: {
            token: token,
            id: user._id,
            email: user.email,
            displayName: user.displayName
        }
    });
}

function validate(userLogin) {
    const scheme = Joi.object({
        email: Joi.string().required().min(5).email(),
        password: Joi.string().required().min(5),
    })
    return scheme.validate(userLogin);
}