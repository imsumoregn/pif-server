const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");

const environment = require("../environments/environment.local");
const error = require("../middlewares/error");

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: (origin, callback) => {
        if (environment.allowOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );
  app.use(helmet());
  app.use(express.json());

  // routes for api

  app.use(error);
};
