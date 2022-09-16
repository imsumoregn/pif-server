const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
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
} = require("./user.service");
const authorization = require("../../middlewares/authorization.middleware");

router.post("/register", registerUser);

router.get("/me", [authorization], getUserProfile);

router.put(
  "/me/avatar",
  [authorization, upload.single("avatar")],
  uploadAvatar
);

router.post("/auth", login);

router.post("/auth/token-refresh", authTokenRefresh);

router.get("/auth/email-confirmation/:token", userEmailConfirmation);

router.post("/auth/password-reset-request", userRequestPasswordReset);

router.get("/auth/password-reset/:token", userVerifyPasswordResetToken);

router.post("/auth/password-change", [authorization], userResetPassword);

router.patch("/me", [authorization], updateUserProfile);

router.get("/:id", getUserById);

module.exports = router;
