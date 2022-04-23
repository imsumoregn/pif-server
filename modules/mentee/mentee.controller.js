const _ = require("lodash");

const { Mentee } = require("../../models/index");

const registerMentee = async () => {};

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

const menteeLogin = async () => {};

const menteeTokenRefresh = async () => {};

const menteeEmailConfirmation = async () => {};

const menteeRequestPasswordReset = async () => {};

const menteeVerifyPasswordResetToken = async () => {};

const menteeResetPassword = async () => {};

module.exports = {
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
