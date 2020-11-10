const bcrypt = require('bcrypt');
const { func } = require('joi');
const Joi = require('joi');

const { User } = require('../models/user');

exports.login = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid username or password');

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send('Invalid username or password');

    const token = user.generateAuthToken();

    res.send(token);
}

function validate(userLogin) {
    const scheme = Joi.object({
        email: Joi.string().required().min(5).email(),
        password: Joi.string().required().min(5),
    })
    return scheme.validate(userLogin);
}