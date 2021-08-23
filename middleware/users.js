const jwt = require('jsonwebtoken');

module.exports = {
    validateRegister: (req, res, next) => {
        if(!req.body.username || req.body.username.length < 6) {
            return res.status(400).send({
                message: "Please enter an username with min 6 chars",
            });
        }
        if(!req.body.password || req.body.password.length < 6) {
            return res.status(400).send({
                message: "Please enter an password with min 6 chars",
            });
        }
        if(!req.body.password_repeat || req.body.password_repeat != req.body.password) {
            return res.status(400).send({
                message: "Passwords must match",
            });
        }
        next();
    },
    isLoggedIn: (req, res, next) => {
        try {
            const token = req.headers.auth_token.split(' ')[1];
            const decoded = jwt.verify(
                token,
                '12345678912345678901234567890'
            );
            req.userData = decoded;
            next();
        } catch (err) {
            return res.status(401).send({
                msg: 'Your session is not valid!'
            });
        }
    }
}
