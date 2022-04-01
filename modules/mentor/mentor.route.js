const express = require("express");
const router = express.Router();

const {
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentor,
  updateMentorAvatar,
} = require("./mentor.controller");

router.get("/", getAllMentors);

router.get("/:id", getMentorById);

router.post("/", createMentor);

router.patch("/:id", updateMentor);

router.put("/:id", updateMentorAvatar);

module.exports = router;
