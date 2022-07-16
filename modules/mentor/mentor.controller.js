const express = require("express");
const multer = require("multer");
const router = express.Router();

const { filterMentor, getAllReviewsByMentorId } = require("./mentor.service");

router.get("/:id/reviews", getAllReviewsByMentorId);

router.post("/search", filterMentor);

module.exports = router;
