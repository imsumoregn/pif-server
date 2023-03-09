const jwt = require("jsonwebtoken");
const {User} = require("../models");

/**
 * Middleware to validate token attached to request.
 *
 * We are obliged to query the database, since `id` is also a validating criterion,
 * so the result is cached in `req.context.user` to avoid querying the database again.
 */
const authorization = async (req, res, next) => {

    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {

        const error = new Error('Unauthorised.');
        error.status = 401;
        throw error;

    }

    let decoded;

    try {

        decoded = jwt.verify(token, process.env.JWT_SECRET);

    } catch (jwtError) {

        jwtError.status = 401;
        throw jwtError;

    }

  console.log(decoded.id)

    const user = await User.findByPk(decoded.id);

    if (!user) {

        const error = new Error('Unauthorised.');
        error.status = 401;
        throw error;

    }

    req.context = {};
    req.context.user = user;
    req.context.aud = decoded.aud;

    console.log(user.dataValues)

    return next();

};

module.exports = authorization;
