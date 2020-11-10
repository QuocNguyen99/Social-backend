const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    const token = req.header('token');
    if (!token) return res.status(401).send('Access denied. Need to token');

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid Token');
    }
}

module.exports = checkAuth;