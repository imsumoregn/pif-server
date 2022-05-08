const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

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
const authorization = require("../../middlewares/authorization.middleware");

router.get("/all", getAllMentees);

router.post("/register", registerMentee);

router.get("/me", [authorization], getMenteeProfile);

router.patch("/me", updateMenteeProfile);

router.put(
  "/me/avatar",
  [authorization, upload.single("avatar")],
  updateMenteeAvatar
);

router.post("/auth", menteeLogin);

router.post("/auth/token-refresh", menteeTokenRefresh);

router.get("/auth/email-confirmation/:token", menteeEmailConfirmation);

router.post("/auth/password-reset-request", menteeRequestPasswordReset);

router.get("/auth/password-reset/:token", menteeVerifyPasswordResetToken);

router.post("/auth/password-change", menteeResetPassword);

module.exports = router;
