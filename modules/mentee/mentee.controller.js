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
    data: mentee,
    message: "Get profile successfully.",
  });
};

const updateMenteeProfile = async () => {};

const updateMenteeAvatar = async () => {};

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
