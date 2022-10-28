const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const timeout = require("connect-timeout");
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require('express-session');

const error = require("../middlewares/error.middleware");
const swaggerDocument = require("../config/swagger.json");
const {logInWithGoogle} = require("../modules/user/user.service");
const {MENTOR_URL} = require("../modules/mentor/mentor.constant");
const {REVIEW_URL} = require("../modules/review/review.constant");
const {
    USER_URL,
    REFRESH_TOKEN,
    ACCESS_TOKEN,
} = require("../modules/user/user.constant");
const mentor = require("../modules/mentor/mentor.controller");
const review = require("../modules/review/review.controller");
const user = require("../modules/user/user.controller");
const field = require("../modules/field/field.controller");
const offer = require("../modules/offer/offer.controller");
const {formatToken} = require("../helpers/token.helper");

module.exports = (app) => {
    app.use(timeout("15s"));

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(
        cors({
            origin: "*",
            exposedHeaders: ["Authorization", "Refresh-Token"],
        }),
    );
    app.use(helmet());
    app.use(express.json());
    app.use(session({secret: 'SECRET'}));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        passReqToCallback: true,
    }, logInWithGoogle));

    app.get("/api/auth/google", passport.authenticate("google", {
        scope: ["profile", "email"],
        successRedirect: "/",
        failureRedirect: "/login",
        session: false,
    }));

    app.get("/api/auth/google/callback", passport.authenticate("google"), async (req, res) => {
        const user = req.user;

        const accessToken = formatToken(user.generateAuthToken(ACCESS_TOKEN));
        const refreshToken = user.generateAuthToken(REFRESH_TOKEN);

        res.header("Authorization", accessToken);
        res.header("Refresh-Token", refreshToken);

        return res.status(200).json({
            isError: false, message: "Login successfully.",
        });
    });

    app.use(MENTOR_URL, mentor);
    app.use(REVIEW_URL, review);
    app.use(USER_URL, user);
    app.use("/api/fields", field);
    app.use("/api/offers", offer);

    app.use("/documents", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(error);
};
