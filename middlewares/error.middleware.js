const winston = require("winston");

function error(err, req, res, next) {
  winston.error("error", err.message);
  return res.status(500).send({ isError: true, message: "Internal Server Error!" });
}

module.exports = error;
