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
const { MENTOR_URL } = require("../modules/mentor/mentor.constant");
const { REVIEW_URL } = require("../modules/review/review.constant");
const { USER_URL } = require("../modules/user/user.constant");
const mentor = require("../modules/mentor/mentor.controller");
const review = require("../modules/review/review.controller");
const user = require("../modules/user/user.controller");

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
        callbackURL: "/api/auth/google/callback",
        passReqToCallback: true,
      },
      loginWithGoogle
    )
  );
  app.get(
    "/api/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  app.get("/api/auth/google/callback", passport.authenticate("google"));

  app.use(MENTOR_URL, mentor);
  app.use(REVIEW_URL, review);
  app.use(USER_URL, user);

  app.use("/documents", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(error);
};
