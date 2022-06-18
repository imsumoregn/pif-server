const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const {
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentorById,
  deleteMentorById,
  updateMentorAvatar,
  filterMentor,
  getAllReviewsByMentorId,
} = require("./mentor.controller");

router.get("/", getAllMentors);

router.get("/:id/reviews", getAllReviewsByMentorId);

router.get("/:id", getMentorById);

router.post("/", createMentor);

router.patch("/:id", updateMentorById);

router.put("/:id/avatar", upload.single("avatar"), updateMentorAvatar);

router.delete("/:id", deleteMentorById);

router.post("/search", filterMentor);

module.exports = router;
