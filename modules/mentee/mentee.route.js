const express = require("express");
const router = express.Router();

const {
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
} = require("./mentee.controller");

router.get("/all", getAllMentees);

router.post("/register", registerMentee);

router.get("/me", getMenteeProfile);

router.patch("/me", updateMenteeProfile);

router.put("/me/avatar", updateMenteeAvatar);

router.post("/auth", menteeLogin);

router.post("/auth/token-refresh", menteeTokenRefresh);

router.get("/auth/email-confirmation/:token", menteeEmailConfirmation);

router.post("/auth/password-reset-request", menteeRequestPasswordReset);

router.get("/auth/password-reset/:token", menteeVerifyPasswordResetToken);

router.post("/auth/password-change", menteeResetPassword);

module.exports = router;
