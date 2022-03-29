const logger = require("../setup/logger");

function error(err, req, res, next) {
  logger.error("error", err.message);
  return res.status(500).send({ isError: true, message: "Internal Server Error!" });
}

module.exports = error;
