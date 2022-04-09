const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const timeout = require("connect-timeout");

const error = require("../middlewares/error.middleware");
const { MENTEE_URL } = require("../modules/mentee/mentee.constant");
const { MENTOR_URL } = require("../modules/mentor/mentor.constant");
const mentee = require("../modules/mentee/mentee.route");
const mentor = require("../modules/mentor/mentor.route");

module.exports = (app) => {
  app.use(timeout("15s"));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(helmet());
  app.use(express.json());

  app.use(MENTEE_URL, mentee);
  app.use(MENTOR_URL, mentor);

  app.use(error);
};
