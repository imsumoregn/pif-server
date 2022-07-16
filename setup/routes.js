const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const timeout = require("connect-timeout");
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const error = require("../middlewares/error.middleware");
const swaggerDocument = require("../config/swagger.json");
const { loginWithGoogle } = require("../modules/user/user.service");

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

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://mentorship-v2.firebaseapp.com/__/auth/handler",
        passReqToCallback: true,
      },
      loginWithGoogle
    )
  );

  app.use("/documents", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(error);
};
