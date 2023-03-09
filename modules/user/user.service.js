const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");
const validator = require("validator");
const {v4: uuid} = require("uuid");
const {bucket} = require("../../setup/firebase");

const {User, Mentor, Mentee} = require("../../models/index");
const {
    validateLogIn,
    validateUpdateMentor,
    validateUpdateUser,
    validateChangePassword,
    validateRegisterUser,
} = require("../../helpers/validator.helper");
const {
    sendConfirmRegisteringEmailMail,
    sendConfirmPasswordResetMail,
} = require("../../setup/email");
const environment = require("../../environments/environment.local");
const {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    MENTOR,
    RESET_PASSWORD_TOKEN,
    CONFIRM_EMAIL_TOKEN,
} = require("./user.constant");
const {formatToken} = require("../../helpers/token.helper");

const MENTOR_FIELDS = [
    "bookingUrl",
    "scopes",
    "fields",
    "offers",
];

/**
 * Creates new user, and sends email to confirm registration.
 *
 * @endpoint `/register`
 * @access PUBLIC
 */
const register = async (req, res) => {

    const {error: joiError} = validateRegisterUser(req.body)

    if (joiError) {

        const error = new Error(joiError.details[0].message.replace(/\"/g, "'"));
        error.status = 400;
        throw error;

    }

    const emailUsed = await User.findOne({where: {email: req.body.email}});

    if (emailUsed) {

        const error = new Error("Email already exists!");
        error.status = 400;
        throw error;

    }

    let newUser;
    let userDataToResponse;

    if (req.body.role === MENTOR) {

        const userData = Object.assign(_.omit(req.body, MENTOR_FIELDS), {registeringMethod: 'basic'});
        newUser = await User.create(userData);
        await Mentor.create({
            ..._.pick(req.body, MENTOR_FIELDS),
            userId: newUser.id,
        });
        userDataToResponse = _.omit({...req.body, ...newUser.dataValues}, ["password"]);

    } else {

        const userData = Object.assign(req.body, {registeringMethod: "basic"});
        newUser = await User.create(userData);
        await Mentee.create({userId: newUser.id});
        userDataToResponse = _.omit(newUser.dataValues, ["password"]);

    }

    try {

        await sendConfirmRegisteringEmailMail(newUser);

    } catch (error) {

        // TODO: Handle mail sending error with automatic retry mechanism.

    }

    return res.status(200).json({
        isError: false,
        data: userDataToResponse,
        message: "Registered successfully.",
    });

};

/**
 * Retrieves user information using `id`
 * coming from the `req.context.user.id` (attached at `auth` middleware)
 *
 * @endpoint `/me`
 * @access PRIVATE
 */
const getUserProfile = async (req, res) => {

    const currentUserData = req.context.user.dataValues;
    let profile;

    if (currentUserData.role === MENTOR) {

        profile = await Mentor.findOne({where: {userId: currentUserData.id}});

    } else {

        profile = await Mentee.findOne({where: {userId: currentUserData.id}});

    }

    Object.assign(
        currentUserData,
        _.omit(profile.dataValues, ["id", "userId"]),
        {
            externalReference: profile.dataValues.id,
        },
    );

    return res.status(200).json({
        isError: false,
        data: _.omit(currentUserData, ["password"]),
        message: "Get profile successfully.",
    });

};

const uploadAvatar = async (req, res) => {

    if (!req.file) {

        const error = new Error("No files have been uploaded!");
        error.status = 400;
        throw error;

    }

    const token = uuid();

    const imageStorageName = `${new Date().getTime()}_${req.file.originalname}`;

    const blob = bucket.file(imageStorageName);

    const blobWriter = blob.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
            metadata: {
                firebaseStorageDownloadTokens: token,
            },
        },
    });

    blobWriter.on("error", (err) => {
        throw err;
    });

    blobWriter.on("finish", async () => {

        await req.context.user.update({
            avatarUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${imageStorageName}?alt=media&token=${token}`,
        });

        res.status(200).json({
            isError: false,
            message: "Update avatar successfully.",
        });

    });

    blobWriter.end(req.file.buffer);

};

/**
 * Logs user in using email and password.
 * Attaches `accessToken` and `refreshToken` to the response header.
 *
 * @endpoint `/auth`
 * @access PUBLIC
 */
const logIn = async (req, res) => {

    const {error: joiError} = validateLogIn(req.body);

    if (joiError) {

        const error = new Error(joiError.details[0].message.replace(/\"/g, "'"));
        error.status = 400;
        throw error;

    }

    const user = await User.findOne({where: {email: req.body.email}});

    if (!user) {

        const error = new Error('Incorrect email or password.');
        error.status = 400;
        throw error;

    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPassword) {

        const error = new Error('Incorrect email or password.');
        error.status = 400;
        throw error;

    }

    const accessToken = formatToken(user.generateAuthToken(ACCESS_TOKEN));
    const refreshToken = user.generateAuthToken(REFRESH_TOKEN);

    res.header("Authorization", accessToken);
    res.header("Refresh-Token", refreshToken);

    await user.update({isActive: true});

    return res.status(200).json({
        isError: false,
        message: "Logged in successfully.",
    });

};

/**
 *
 * @endpoint `/auth/token-refresh`
 * @access PUBLIC
 */
const clientRefreshAccessToken = async (req, res) => {

    const token = req.header("Refresh-Token");

    if (!token) {

        const error = new Error('Access denied. No token provided.');
        error.status = 401;
        throw error;

    }

    let decoded;

    try {

        decoded = jwt.verify(token, process.env.JWT_SECRET,
            {audience: REFRESH_TOKEN});

    } catch (error) {

        error.status = 401;
        throw error;

    }

    const user = await User.findByPk(decoded.id);

    if (!user) {

        const error = new Error('Access denied. Token invalid.');
        error.status = 401;
        throw error;

    }

    const newAccessToken = formatToken(user.generateAuthToken(ACCESS_TOKEN));

    res.header("Authorization", newAccessToken);

    return res.status(200).json({
        isError: false,
        message: "Refreshed access token successfully.",
    });

};

/**
 * Confirms the token from the url.
 * Client will display view accordingly to the status of
 * the verification.
 *
 * @endpoint `/auth/verify-email/:token`
 * @access PUBLIC
 */
const userVerifyEmail = async (req, res) => {

    let decoded;

    try {

        decoded = jwt.verify(req.params.token, process.env.JWT_SECRET,
            {audience: CONFIRM_EMAIL_TOKEN});

    } catch (error) {

        error.status = 400;
        throw error;

    }

    const user = await User.findByPk(decoded.id);

    if (!user) {

        const error = new Error('Your account does not exist!');
        error.status = 404;
        throw error;

    }

    if (user.hasConfirmedEmail) {

        const error = new Error('Your account has already been confirmed!');
        error.status = 400;
        throw error;

    }

    await user.update({hasConfirmedEmail: true});

    return res.status(200).json({
        isError: false,
        message: "Verified email successfully.",
    });

};

/**
 * Sends an email containing a token
 * to the client-provided address.
 *
 * @endpoint `/auth/reset-password`
 * @access PUBLIC
 */
const userRequestPasswordReset = async (req, res) => {

    const {error: joiError} = Joi.object({
        email: Joi.string().email().required(),
    }).validate(req.body);

    if (joiError) {

        const error = new Error(joiError.details[0].message.replace(/\"/g, "'"));
        error.status = 400;
        throw error;

    }

    const user = await User.findOne({where: {email: req.body.email}});

    if (!user) {

        const error = new Error('This email hasn\'t been used to register any account.');
        error.status = 400;
        throw error;

    }

    try {

        await sendConfirmPasswordResetMail(user);

    } catch (error) {

        // TODO: Handle mail sending error with automatic retry mechanism.

    }

    return res.status(200).json({
        isError: false,
        message: "Reset password verifying email has been sent.",
    });

};

/**
 * Verifies token from URL and redirects user to
 * client's `Change password` page with access and refresh tokens attached.
 * So basically, the user will be logged in if the token is valid.
 *
 * @endpoint `/auth/reset-password/:token`
 * @access PUBLIC
 */
const userVerifyPasswordResetRequest = async (req, res) => {

    let decodedToken;

    try {

        decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET,
            {audience: RESET_PASSWORD_TOKEN});

    } catch (error) {

        error.status = 400;
        throw error;

    }

    const user = await User.findByPk(decodedToken.id);

    if (!user) {

        const error = new Error('Invalid token.');
        error.status = 400;
        throw error;

    }

    const accessToken = formatToken(user.generateAuthToken(ACCESS_TOKEN));
    const refreshToken = user.generateAuthToken(REFRESH_TOKEN);

    res.header("Authorization", accessToken);
    res.header("Refresh-Token", refreshToken);

    // return res.redirect(
    //     `${environment.client}/user/change-password`,
    // );

    return res.status(200).json({
        isError: false,
        message: "Reset password token valid.",
    });

};

/**
 * Verifies new password's validity, makes sure it does not match
 * the old one, and saves it to the database.
 *
 * @endpoint `/auth/password-change`
 * @access PRIVATE
 */
const userChangePassword = async (req, res) => {

    const {error: joiError} = validateChangePassword(req.body);

    if (joiError) {

        const error = new Error(joiError.details[0].message.replace(/\"/g, "'"));
        error.status = 400;
        throw error;

    }

    const {currentPassword, newPassword} = req.body;
    const storedCurrentPassword = req.context.user.dataValues.password;
    const isIncorrectCurrentPassword = await bcrypt.compare(currentPassword, storedCurrentPassword);

    if (isIncorrectCurrentPassword) {

        const error = new Error('Current password is incorrect.');
        error.status = 400;
        throw error;

    }

    const isMatchedWithPreviousPassword = await bcrypt.compare(newPassword, storedCurrentPassword);

    if (isMatchedWithPreviousPassword) {

        const error = new Error('New password should not match with current password!');
        error.status = 400;
        throw error;

    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_USER_PW));

    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await req.context.user.update({password: hashedNewPassword});

    return res.status(200).json({
        isError: false,
        message: "Password is successfully changed.",
    });

};


/**
 *
 * @endpoint `/me`
 * @access PRIVATE
 */
const userUpdateProfile = async (req, res) => {

    const currentUserData = req.context.user.dataValues;

    const {error: joiError} =
        currentUserData.role === MENTOR || req.body.role === MENTOR
            ? validateUpdateMentor(req.body)
            : validateUpdateUser(req.body);

    if (joiError) {

        const error = new Error(joiError.details[0].message.replace(/\"/g, "'"));
        error.status = 400;
        throw error;

    }

    await req.context.user.update(_.omit(req.body, MENTOR_FIELDS));

    let profile;

    if (currentUserData.role === MENTOR || req.body.role === MENTOR) {

        profile = await Mentor.findOne({where: {userId: currentUserData.id}});
        await profile.update(_.pick(req.body, MENTOR_FIELDS));

    } else {

        profile = await Mentee.findOne({where: {userId: currentUserData.id}});
        await profile.update(req.body);

    }

    Object.assign(
        currentUserData,
        _.omit(profile.dataValues, ["id", "userId"]),
        {
            externalReference: profile.dataValues.id,
        },
    );

    return res.status(200).json({
        isError: false,
        data: _.omit(currentUserData, ["password"]),
        message: "Update user's profile successfully.",
    });

};

/**
 *
 * @endpoint `/:id`
 * @access PUBLIC
 */
const getUserById = async (req, res) => {

    const isValidId = validator.isUUID(req.params.id, 4);

    if (!isValidId) {

        const error = new Error("Invalid ID!");
        error.status = 400;
        throw error;

    }

    const user = await User.findByPk(req.params.id);
    console.log(req.params.id)

    if (!user) {

        const error = new Error("User not found!");
        error.status = 404;
        throw error;

    }

    let profile;

    if (user.dataValues.role === MENTOR) {

        profile = await Mentor.findOne({where: {userId: req.params.id}});

    } else {

        profile = await Mentee.findOne({where: {userId: req.params.id}});

    }

    Object.assign(
        user.dataValues,
        _.omit(profile.dataValues, ["id", "userId"]),
        {
            externalReference: profile.dataValues.id,
        },
    );

    return res.status(200).json({
        isError: false,
        data: _.omit(user.dataValues, ["password"]),
        message: `Get user with id ${req.params.id} successfully.`,
    });

};

const logInWithGoogle = async (
    accessToken,
    refreshToken,
    temp,
    profile,
    done,
) => {

    try {

        const user = await User.findOne({
            where: {email: profile.emails[0].value},
        });

        if (user) {

            // if (user.id !== profile.id) {

            //     return done(new Error("Email has already been used!"), user);

            // }

            return done(null, user);

        } else {

            const created = await User.create({
                id: uuid(),
                email: profile.emails[0].value,
                name: profile.displayName,
                hasConfirmedEmail: true,
                registeringMethod: "google",
                isActive: true,
                password: profile.id,
                avatarUrl: profile.photos.length ? profile.photos[0].value : null,
            });

            return done(null, created);

        }

    } catch (error) {

        return done(error, false);

    }

};

module.exports = {
    uploadAvatar,
    register,
    getUserProfile,
    logIn,
    clientRefreshAccessToken,
    userVerifyEmail,
    userRequestPasswordReset,
    userVerifyPasswordResetRequest,
    userChangePassword,
    userUpdateProfile,
    getUserById,
    logInWithGoogle,
    MENTOR_FIELDS
};
