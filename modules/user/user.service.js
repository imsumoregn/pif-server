const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");
const validator = require("validator");
const { v4: uuid } = require("uuid");

const { User, Mentor } = require("../../models/index");
const {
  validateCreateUser,
  validateLogin,
  validateCreateMentor,
  validateUpdateMentor,
  validateUpdateUser,
} = require("../../helpers/validator.helper");
const {
  mailConfirmationAccount,
  mailResetPassword,
} = require("../../setup/email");
const environment = require("../../environments/environment.local");
const { ACCESS_TOKEN, REFRESH_TOKEN, MENTOR } = require("./user.constant");

const mentorFields = [
  "location",
  "linkedin",
  "bookingUrl",
  "github",
  "scopes",
  "fields",
  "offers",
];

const registerUser = async (req, res) => {
  if (!req.body?.role) {
    return res.status(400).json({
      isError: true,
      message: "Missing user's role!",
    });
  }

  const { error } =
    req.body.role === MENTOR
      ? validateCreateMentor(req.body)
      : validateCreateUser(req.body);
  if (error) {
    return res.status(400).json({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    return res.status(400).json({
      isError: true,
      message: "Email already exists!",
    });
  }

  const newUser =
    req.body.role === MENTOR
      ? User.build(_.omit(req.body, mentorFields))
      : User.build(req.body);
  newUser.save().then(async (response, reject) => {
    mailConfirmationAccount(response);
    await Mentor.create({
      ..._.pick(req.body, mentorFields),
      userId: response.id,
    });
  });

  return res.status(200).json({
    isError: false,
    data:
      req.body.role === MENTOR
        ? _.omit({ ...req.body, ...newUser.dataValues }, ["password"])
        : _.omit(newUser.dataValues, ["password"]),
    message: "Register user successfully.",
  });
};

const getUserProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({
      isError: true,
      message: "User not found!",
    });
  }

  if (user.role === MENTOR) {
    const mentor = await Mentor.findOne({ where: { userId: req.user.id } });
    Object.assign(user, mentor);
  }

  return res.status(200).json({
    isError: false,
    data: _.omit(user, ["password"]),
    message: "Get profile successfully.",
  });
};

const uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      isError: true,
      message: "No files have been uploaded!",
    });
  }

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({
      isError: true,
      message: "User not found!",
    });
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
    await user.update({
      avatar: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${imageStorageName}?alt=media&token=${token}`,
    });

    res.status(200).json({
      isError: false,
      message: "Update avatar successfully.",
    });
  });

  blobWriter.end(req.file.buffer);
};

const login = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return res.status(400).json({
      isError: true,
      message: "Incorrect email or password!",
    });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      isError: true,
      message: "Incorrect email or password!",
    });
  }

  const token = user.generateAuthToken();
  const refreshToken = user.generateAuthToken();
  const now = new Date();
  await Token.bulkBuild(
    {
      value: token,
      type: ACCESS_TOKEN,
      expiredDate: new Date().setMinutes(
        now.getMinutes() + Number(process.env.ACCESS_TOKEN_ALIVE_MINUTES)
      ),
    },
    {
      value: refreshToken,
      type: REFRESH_TOKEN,
      expiredDate: new Date().setDate(
        now.getDate() + Number(process.env.REFRESH_TOKEN_ALIVE_DAYS)
      ),
    }
  )
    .save()
    .then(() => {
      res.header("Authorization", token);
      res.header("Refresh-Token", refreshToken);
    });

  return res.status(200).json({
    isError: false,
    message: "Login successfully.",
  });
};

const authTokenRefresh = async (req, res) => {
  const token = req.header("Refresh-Token");
  if (!token) {
    return res
      .status(401)
      .json({ isError: true, message: "Access denied. No token provided!" });
  }

  const isAvailable = await Token.findOne({
    where: { value: token, status: TOKEN_ACTIVE },
  });
  if (!isAvailable) {
    return res.status(401).json({ isError: true, message: "Token exprired!" });
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!user.isConfirmedEmail) {
      return res
        .status(403)
        .json({ isError: true, message: "Email has not been confirmed yet!" });
    }
  } catch (e) {
    return res.status(400).json({ isError: true, message: "Invalid token!" });
  }

  user = await User.findByPk(user.id);

  if (!user) {
    return res.status(404).json({
      isError: true,
      message: "User not found!",
    });
  }

  const newToken = user.generateAuthToken();
  const now = new Date();
  Token.build({
    value: newToken,
    type: ACCESS_TOKEN,
    expiredDate: new Date().setMinutes(
      now.getMinutes() + Number(process.env.ACCESS_TOKEN_ALIVE_MINUTES)
    ),
  })
    .save()
    .then(() => {
      res.header("Authorization", newToken);
    });

  return res.status(200).json({
    isError: false,
    message: "Refresh access token successfully.",
  });
};

const userEmailConfirmation = async (req, res) => {
  const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return res.status(400).json({ isError: true, message: "Invalid token!" });
  }

  const user = await User.findByPk(decoded.id);
  if (!user) {
    return res
      .status(404)
      .json({ isError: true, message: "Your account does not exist!" });
  }

  if (user.isConfirmedEmail) {
    return res.status(400).json({
      isError: true,
      message: "Your account has already been confirmed!",
    });
  }

  await user.update({ isConfirmedEmail: true });
  return res
    .status(200)
    .json({ isError: false, message: "Confirm your email successfully." });
};

const userRequestPasswordReset = async (req, res) => {
  const { error } = Joi.object({
    email: Joi.string().email().required(),
  }).validate(req.body);

  if (error) {
    return res.status(400).json({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return res.status(404).json({
      isError: true,
      message: "Not found user!",
    });
  }

  mailResetPassword(user);
  return res.status(200).json({
    isError: false,
    message: "Reset password mail has been sent.",
  });
};

const userVerifyPasswordResetToken = async (req, res) => {
  const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return res.status(400).json({ isError: true, message: "Invalid token!" });
  }

  const user = await User.findByPk(decoded.id);
  if (!user) {
    return res
      .status(404)
      .json({ isError: true, message: "Your account does not exist!" });
  }

  return res.redirect(
    `${environment.client}/user/password-recovered?token=${req.params.token}`
  );
};

const userResetPassword = async (req, res) => {
  const { error } = Joi.object({
    password: Joi.string().min(6).required(),
    confirmedPassword: Joi.string()
      .min(6)
      .valid(Joi.ref("password"))
      .required(),
  }).validate(req.body);

  if (error) {
    return res.status(400).json({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({
      isError: true,
      message: "User not found!",
    });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    return res.status(400).json({
      isError: true,
      message: "New password should not match with current password!",
    });
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT_USER_PW));
  req.body.password = await bcrypt.hash(req.body.password, salt);
  await user.update({ password: req.body.password });

  return res.status(200).json({
    isError: false,
    message: "Reset password successfully!",
  });
};

const updateUserProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({
      isError: true,
      message: "User not found!",
    });
  }

  const { error } =
    user.role === MENTOR
      ? validateUpdateMentor(req.body)
      : validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  await user.update(_.omit(req.body, mentorFields));

  if (user.role === MENTOR) {
    const mentor = await Mentor.findOne({ where: { userId: req.user.id } });
    await mentor.update(_.pick(req.body, mentorFields));
    Object.assign(user, mentor);
  }

  const token = user.generateAuthToken();
  const now = new Date();
  await Token.build({
    value: token,
    type: ACCESS_TOKEN,
    expiredDate: new Date().setMinutes(
      now.getMinutes() + Number(process.env.ACCESS_TOKEN_ALIVE_MINUTES)
    ),
  })
    .save()
    .then(() => {
      res.header("Authorization", token);
    });

  await Token.update(
    { status: TOKEN_EXPRIRED },
    {
      where: {
        value: req.header("Authorization"),
      },
    }
  );

  return res.status(200).json({
    isError: false,
    data: _.omit(user, ["password"]),
    message: "Update user successfully.",
  });
};

const getUserById = async (req, res) => {
  if (!validator.isUUID(req.params.id, 4)) {
    return res.status(400).json({
      isError: true,
      message: "Invalid ID!",
    });
  }

  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({
      isError: true,
      message: "User not found!",
    });
  }

  if (user.role === MENTOR) {
    const mentor = await Mentor.findOne({ where: { userId: req.params.id } });
    Object.assign(user, mentor);
  }

  return res.status(200).json({
    isError: false,
    data: _.omit(user, ["password"]),
    message: `Get user with id ${req.params.id} successfully.`,
  });
};

const loginWithGoogle = async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({
      where: { email: profile.emails[0].value },
    });

    if (user) {
      if (user.id !== profile.id) {
        return res.status(400).json({
          isError: true,
          message: "Email has already been used!",
        });
      }
      return done(null, user);
    } else {
      const created = await User.create({
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        isConfirmed: true,
        method: "google",
      });

      return done(null, created);
    }
  } catch (error) {
    return done(error, false);
  }
};

module.exports = {
  uploadAvatar,
  registerUser,
  getUserProfile,
  login,
  authTokenRefresh,
  userEmailConfirmation,
  userRequestPasswordReset,
  userVerifyPasswordResetToken,
  userResetPassword,
  updateUserProfile,
  getUserById,
  loginWithGoogle,
};
