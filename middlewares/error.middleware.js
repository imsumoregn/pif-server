const logger = require("../setup/logger");

const error = (err, req, res, next) => {

    logger.error({
        status: err.status,
        message: err.message,
        stack: err.stack
    });

    next()

    return res
        .status(err.status || 500)
        .json({isError: true, message: err.message || 'Internal server error.'});

};

module.exports = error;
