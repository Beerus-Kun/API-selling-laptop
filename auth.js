const jwt = require('jsonwebtoken');

const auth = {};

auth.tokenData = (req) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return null;

    const token = authorizationHeader.split(' ')[1];
    var result = null;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            result = data;
        }
    })
    return result;
}

auth.authenAdmin = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return res.sendStatus(401);

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        if (data.position != 2) return res.sendStatus(403);
        next();
    })
}

auth.authenStocker = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return res.sendStatus(401);

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        if (data.position != 1) return res.sendStatus(403);
        else next();
    })
}

auth.authenPersonel = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return res.sendStatus(401);

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        if (data.position == 0) return res.sendStatus(403);
        else next();
    })
}

auth.authenUser = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return res.sendStatus(401);

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        next();
    })
}

module.exports = auth;