const winston = require("winston");
require("express-async-errors");

const environment = require("../environments/environment.local");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  exceptionHandlers: [
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({
      filename: `${__dirname}/${environment.log.exception}`,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({
      filename: `${__dirname}/${environment.log.rejection}`,
    }),
  ],
  transports: [
    new winston.transports.File({
      filename: `${__dirname}/${environment.log.general}`,
      level: "info",
    }),
  ],
});

if (!environment.production) {
  logger.add(
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );
}

module.exports = logger;
