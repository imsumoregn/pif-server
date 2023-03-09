const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const timeout = require("connect-timeout");
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require('express-session');
const _ = require("lodash");

const error = require("../middlewares/error.middleware");
const swaggerDocument = require("../config/swagger.json");
const {logInWithGoogle, MENTOR_FIELDS} = require("../modules/user/user.service");
const {MENTOR_URL} = require("../modules/mentor/mentor.constant");
const {REVIEW_URL} = require("../modules/review/review.constant");
const {
    USER_URL,
    REFRESH_TOKEN,
    ACCESS_TOKEN,
    MENTOR,
    MENTEE,
} = require("../modules/user/user.constant");
const mentor = require("../modules/mentor/mentor.controller");
const review = require("../modules/review/review.controller");
const user = require("../modules/user/user.controller");
const field = require("../modules/field/field.controller");
const offer = require("../modules/offer/offer.controller");
const {formatToken} = require("../helpers/token.helper");
const {User, Mentor, Mentee} = require("../models");

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

    app.set("trust proxy", 1);
    app.use(session({secret: 'SECRET', proxy: true}));

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

    app.get("/api/auth/google", (req, res, next) => {
        passport.authenticate("google", {
            scope: ["profile", "email"],
            successRedirect: "/",
            failureRedirect: "/login",
            session: false,
            state:JSON.stringify([req.query.role, req.query.action]) 
        })(req, res, next)
    });

    app.get("/api/auth/google/callback", passport.authenticate("google"), async (req, res) => {
        const user = req.user;
        const [userRole, action] = JSON.parse(req.query.state);

        const accessToken = formatToken(user.generateAuthToken(ACCESS_TOKEN));
        const refreshToken = user.generateAuthToken(REFRESH_TOKEN);

        if (action === "login") {
          console.log(user.role)
          if (!user.role) return res.redirect("http://localhost:3000/login?status=404");
          return res.redirect(`http://localhost:3000/login?id=${user.id}&at=${accessToken}&rt=${refreshToken}`);
        }

        await user.update({role: userRole})

        if (userRole === MENTOR) {

            await Mentor.create({
                ..._.pick(user, MENTOR_FIELDS),
                userId: user.id,
            });

        } else {

            await Mentee.create({userId: user.id});

        } 

        return res.redirect(`http://localhost:3000/user/create-account?id=${user.id}&at=${accessToken}&rt=${refreshToken}`);
    });

    app.use(MENTOR_URL, mentor);
    app.use(REVIEW_URL, review);
    app.use(USER_URL, user);
    app.use("/api/fields", field);
    app.use("/api/offers", offer);

    app.use("/documents", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(error);
};
