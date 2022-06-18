const { Review, Mentor, Mentee } = require("../../models/index");

const postNewReview = async (req, res) => {
  const mentee = await Mentee.findByPk(req.user.id);
  if (!mentee) {
    return res.status(404).json({
      isError: true,
      message: "Mentee not found!",
    });
  }

  const mentor = await Mentor.findByPk(req.body.mentorId);
  if (!mentor) {
    return res.status(404).json({
      isError: true,
      message: "Mentor not found!",
    });
  }

  const created = await Review.create({ ...body, menteeId: req.user.id });
  return res.status(200).json({
    isError: false,
    data: created,
    message: "Post review successfully.",
  });
};

module.exports = { postNewReview };
