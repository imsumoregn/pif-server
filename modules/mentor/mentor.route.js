const express = require("express");
const router = express.Router();

const {
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentorById,
  deleteMentorById,
} = require("./mentor.controller");

router.get("/", getAllMentors);

router.get("/:id", getMentorById);

router.post("/", createMentor);

router.patch("/:id", updateMentorById);

router.delete("/:id", deleteMentorById);

module.exports = router;
