const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");
const { Op } = require("sequelize");

const { Mentee, Token } = require("../../models/index");
const {
  validateCreateMentee,
  validateLoginMentee,
  validateUpdateMentee,
} = require("../../helpers/validator.helper");
const {
  mailConfirmationAccount,
  mailResetPassword,
} = require("../../setup/email");
const environment = require("../../environments/environment.local");
const {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TOKEN_EXPRIRED,
} = require("./mentee.constant");

const registerMentee = async (req, res) => {
  const { error } = validateCreateMentee(req.body);
  if (error) {
    return res.status(400).json({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  let mentee = await Mentee.findOne({ where: { email: req.body.email } });
  if (mentee) {
    return res.status(400).json({
      isError: true,
      message: "Email already exists!",
    });
  }

  mentee = req.body;
  mentee.schools = mentee.schools?.map((data) => data.trim()) || [];
  mentee.exp = mentee.exp?.map((data) => data.trim()) || [];
  const salt = await bcrypt.genSalt(Number(process.env.SALT_MENTEE_PW));
  mentee.password = await bcrypt.hash(req.body.password, salt);

  const newMentee = Mentee.build(mentee);
  await newMentee.save().then((response, reject) => {
    mailConfirmationAccount(response);
  });

  return res.status(200).json({
    isError: false,
    data: _.omit(newMentee.dataValues, ["password"]),
    message: "Register mentee successfully.",
  });
};

const getAllMentees = async (req, res) => {
  const mentees = await Mentee.findAll({
    attributes: { exclude: ["password"] },
  });

  return res.status(200).json({
    isError: false,
    data: mentees,
    message: "Get all mentees successfully.",
  });
};

const getMenteeProfile = async (req, res) => {
  const mentee = await Mentee.findByPk(req.user.id);
  if (!mentee) {
    return res.status(404).json({
      isError: true,
      message: "Mentee not found!",
    });
  }

  return res.status(200).json({
    isError: false,
    data: _.omit(mentee, ["password"]),
    message: "Get profile successfully.",
  });
};

const updateMenteeAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      isError: true,
      message: "No files have been uploaded!",
    });
  }

  const mentee = await Mentee.findByPk(req.user.id);
  if (!mentee) {
    return res.status(404).json({
      isError: true,
      message: "Mentee not found!",
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
    await mentee.update({
      avatarUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${imageStorageName}?alt=media&token=${token}`,
    });

    res.status(200).json({
      isError: false,
      message: "Update avatar successfully.",
      data: _.omit(mentee, ["password"]),
    });
  });

  blobWriter.end(req.file.buffer);
};

const menteeLogin = async (req, res) => {
  const { error } = validateLoginMentee(req.body);
  if (error) {
    return res.status(400).json({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  const mentee = await Mentee.findOne({ where: { email: req.body.email } });
  if (!mentee) {
    return res.status(400).json({
      isError: true,
      message: "Incorrect email or password!",
    });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    mentee.password
  );
  if (!validPassword) {
    return res.status(400).json({
      isError: true,
      message: "Incorrect email or password!",
    });
  }

  const token = mentee.generateAuthToken();
  const refreshToken = mentee.generateAuthToken();
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

const menteeEmailConfirmation = async (req, res) => {
  const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return res.status(400).json({ isError: true, message: "Invalid token!" });
  }

  const mentee = await Mentee.findByPk(decoded.id);
  if (!mentee) {
    return res
      .status(404)
      .json({ isError: true, message: "Your account does not exist!" });
  }

  if (mentee.isConfirmedEmail) {
    return res.status(400).json({
      isError: true,
      message: "Your account has already been confirmed!",
    });
  }

  await mentee.update({ isConfirmedEmail: true });
  return res
    .status(200)
    .json({ isError: false, message: "Confirm your email successfully." });
};

const updateMenteeProfile = async (req, res) => {
  const { error } = validateUpdateMentee(req.body);
  if (error) {
    return res.status(400).json({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  const mentee = await Mentee.findByPk(req.user.id);
  if (!mentee) {
    return res.status(404).json({
      isError: true,
      message: "Mentee not found!",
    });
  }

  req.body.schools = req.body.schools?.map((data) => data.trim());
  req.body.exp = req.body.exp?.map((data) => data.trim());
  await mentee.update(req.body);

  return res.status(200).json({
    isError: false,
    data: mentee,
    message: "Update mentee successfully.",
  });
};

const logout = async (req, res) => {
  await Token.update(
    { status: TOKEN_EXPRIRED },
    {
      where: {
        value: {
          [Op.any]: [req.header("Authorization"), req.header("Refresh-Token")],
        },
      },
    }
  );

  return res.status(200).json({
    isError: false,
    message: "Logout successfully.",
  });
};

const menteeTokenRefresh = async (req, res) => {
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

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!user.isConfirmedEmail) {
      return res
        .status(403)
        .json({ isError: true, message: "Email has not been confirmed yet!" });
    }
  } catch (e) {
    return res.status(400).json({ isError: true, message: "Invalid token!" });
  }

  const newToken = mentee.generateAuthToken();
  const now = new Date();
  await Token.build({
    value: newToken,
    type: ACCESS_TOKEN,
    expiredDate: new Date().setMinutes(
      now.getMinutes() + Number(process.env.ACCESS_TOKEN_ALIVE_MINUTES)
    ),
  })
    .save()
    .then(() => {
      res.header("Authorization", token);
    });

  return res.status(200).json({
    isError: false,
    message: "Refresh access token successfully.",
  });
};

const menteeRequestPasswordReset = async (req, res) => {
  const { error } = Joi.object({
    email: Joi.string().email().required(),
  }).validate(req.body);

  if (error) {
    return res.status(400).json({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  const mentee = await Mentee.findOne({ where: { email: req.body.email } });
  if (!mentee) {
    return res.status(404).json({
      isError: true,
      message: "Not found mentee!",
    });
  }

  mailResetPassword(mentee);
  return res.status(200).json({
    isError: false,
    message: "Reset password mail has been sent.",
  });
};

const menteeVerifyPasswordResetToken = async (req, res) => {
  const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return res.status(400).json({ isError: true, message: "Invalid token!" });
  }

  const mentee = await Mentee.findByPk(decoded.id);
  if (!mentee) {
    return res
      .status(404)
      .json({ isError: true, message: "Your account does not exist!" });
  }

  return res.redirect(
    `${environment.client}/user/password-recovered?token=${req.params.token}`
  );
};

const menteeResetPassword = async (req, res) => {
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

  const mentee = await Mentee.findByPk(req.user.id);
  if (!mentee) {
    return res.status(404).json({
      isError: true,
      message: "Mentee not found!",
    });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    mentee.password
  );
  if (validPassword) {
    return res.status(400).json({
      isError: true,
      message: "New password should not match with current password!",
    });
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT_MENTEE_PW));
  req.body.password = await bcrypt.hash(req.body.password, salt);
  await mentee.update({ password: req.body.password });

  return res.status(200).json({
    isError: false,
    message: "Reset password successfully!",
  });
};

module.exports = {
  getAllMentees,
  registerMentee,
  getMenteeProfile,
  updateMenteeProfile,
  updateMenteeAvatar,
  menteeLogin,
  menteeTokenRefresh,
  menteeEmailConfirmation,
  menteeRequestPasswordReset,
  menteeVerifyPasswordResetToken,
  menteeResetPassword,
  logout,
};
