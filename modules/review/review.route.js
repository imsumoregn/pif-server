const express = require("express");
const authorization = require("../../middlewares/authorization.middleware");
const { postNewReview } = require("./review.controller");
const router = express.Router();

router.post("/", [authorization], postNewReview);

module.exports = router;
