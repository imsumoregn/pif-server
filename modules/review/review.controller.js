const express = require("express");
const router = express.Router();

const authorization = require("../../middlewares/authorization.middleware");
const { postNewReview } = require("./review.service");

router.post("/", [authorization], postNewReview);

module.exports = router;
