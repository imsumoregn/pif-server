const {
  Mentee
} = require("../../models/index");
const bcrypt = require('bcrypt');
const {
  validateCreateMentee,
  validateUpdateMentee,
} = require("../../helpers/validator.helper");

const registerMentee = async (req, res) => {
  const {
    error
  } = validateCreateMentee(req.body);
  if (error) {
    return res.status(400).send({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  let mentee = await Mentee.findOne({
    where: {
      email: req.body.email
    }
  });
  if (mentee) {
    return res.status(400).send({
      isError: true,
      message: "Email already exists!"
    });
  }

  mentee = req.body;
  mentee.schools = mentee.schools.split(",").map((data) => data.trim());
  mentee.exp = mentee.exp.split(",").map((data) => data.trim());
  const salt = await bcrypt.genSalt(10);
  hashedPassword = await bcrypt.hash(req.body.password, salt);
  mentee.password = hashedPassword;

  const newMentee = Mentee.build(mentee);
  await newMentee.save();

  return res.status(200).json({
    isError: false,
    data: newMentee,
    message: "Create mentee successfully.",
  });
};


const getAllMentees = async (req, res) => {
  const mentees = await Mentee.findAll();
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
      isError: false,
      message: "Mentee not found!",
    });
  }

  return res.status(200).json({
    isError: false,
    data: _.omit(mentee, ["password"]),
    message: "Get profile successfully.",
  });
};

const updateMenteeProfile = async () => {};

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
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      isError: false,
      message: "Missing email or password"
    });
  }

  const mentee = await Mentee.findOne({
    where: {
      email: req.body.email
    }
  });
  if (mentee) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(password, mentee.password);
    if (validPassword) {
      res.status(200).json({
        message: "Log in successful."
      });
    } else {
      res.status(400).json({
        error: "Invalid Password"
      });
    }
  } else {
    res.status(401).json({
      error: "User does not exist"
    });
  }
};


const menteeTokenRefresh = async () => {};

const menteeEmailConfirmation = async () => {};

const menteeRequestPasswordReset = async () => {};

const menteeVerifyPasswordResetToken = async () => {};

const menteeResetPassword = async () => {};

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
};