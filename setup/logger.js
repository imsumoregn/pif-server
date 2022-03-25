const winston = require("winston");
require("express-async-errors");

const environment = require("../environments/environment.local");

module.exports = function () {
  // hanle uncaught exceptions
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: environment.log.exception })
  );

  // hanle unhandled rejection
  winston.rejections.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: environment.log.rejection })
  );

  winston.add(
    new winston.transports.File({
      filename: environment.log.general,
      level: "info",
    })
  );
};
