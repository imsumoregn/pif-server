const { Mentor } = require("../../models/index");
const {
  validateCreateMentor,
  validateUpdateMentor,
} = require("../../helpers/validator.helper");

const getAllMentors = async (req, res) => {
  const mentors = await Mentor.findAll();
  return res.status(200).json({
    isError: false,
    data: mentors,
    message: "Get all mentors successfully.",
  });
};

const getMentorById = async (req, res) => {
  const mentor = await Mentor.findByPk(req.params.id);
  if (!mentor) {
    return res.status(404).json({
      isError: true,
      message: "Mentor not found!",
    });
  }

  return res.status(200).json({
    isError: false,
    data: mentor,
    message: `Get mentor with id ${req.params.id} successfully.`,
  });
};

const createMentor = async (req, res) => {
  const { error } = validateCreateMentor(req.body);
  if (error) {
    return res.status(400).send({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  let mentor = await Mentor.findOne({ where: { email: req.body.email } });
  if (mentor) {
    return res
      .status(400)
      .send({ isError: true, message: "Email already exists!" });
  }

  mentor = req.body;
  mentor.schools = mentor.schools.split(",").map((data) => data.trim());
  mentor.exp = mentor.exp.split(",").map((data) => data.trim());

  const newMentor = Mentor.build(req.body);
  await newMentor.save();

  return res.status(200).json({
    isError: false,
    data: newMentor,
    message: "Create mentor successfully.",
  });
};

const updateMentorById = async (req, res) => {
  const { error } = validateUpdateMentor(req.body);
  if (error) {
    return res.status(400).send({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  const mentor = await Mentor.findByPk(req.params.id);
  if (!mentor) {
    return res.status(404).json({
      isError: true,
      message: "Mentor not found!",
    });
  }

  if (req.body.email) {
    const result = await Mentor.findOne({ where: { email: req.body.email } });
    if (result) {
      return res
        .status(400)
        .send({ isError: true, message: "Email already exists!" });
    }
  }

  if (req.body.schools) {
    req.body.schools = req.body.schools.split(",").map((data) => data.trim());
  }

  if (req.body.exp) {
    req.body.exp = req.body.exp.split(",").map((data) => data.trim());
  }
  await mentor.update(req.body);

  return res.status(200).json({
    isError: false,
    data: mentor,
    message: "Update mentor successfully.",
  });
};

const deleteMentorById = async (req, res) => {
  const mentor = await Mentor.findByPk(req.params.id);
  if (!mentor) {
    return res.status(404).json({
      isError: true,
      message: "Mentor not found!",
    });
  }

  await mentor.destroy();
  return res
    .status(200)
    .json({ isError: false, message: "Delete mentor successfully." });
};

module.exports = {
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentorById,
  deleteMentorById,
};
