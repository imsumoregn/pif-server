const winston = require("winston");
require("winston-daily-rotate-file");
require("express-async-errors");

const environment = require("../environments/environment.local");

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `${__dirname}/${environment.log.folder}/%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      prepend: true,
      maxSize: "20m",
    }),
  ],
});

if (!environment.production) {
  logger.add(
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );
}

module.exports = logger;
