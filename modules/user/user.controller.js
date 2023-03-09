const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({storage: multer.memoryStorage()});

const {
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
} = require("./user.service");
const authorization = require("../../middlewares/authorization.middleware");

router.post("/register", register);

router.get("/me", authorization, getUserProfile);

router.put(
    "/me/avatar",
    [authorization, upload.single("avatar")],
    uploadAvatar
);

router.post("/auth", logIn);

router.get("/auth/refresh-token", clientRefreshAccessToken);

router.get("/auth/verify-email/:token", userVerifyEmail);

router.post("/auth/reset-password", userRequestPasswordReset);

router.get("/auth/reset-password/:token", userVerifyPasswordResetRequest);

router.post("/auth/change-password", authorization, userChangePassword);

router.patch("/me", authorization, userUpdateProfile);

router.get("/:id", getUserById);

module.exports = router;
