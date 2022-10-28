const express = require("express");
const router = express.Router();

const authorization = require("../../middlewares/authorization.middleware");
const { menteePostReview } = require("./review.service");

router.post("/", authorization, menteePostReview);

module.exports = router;
