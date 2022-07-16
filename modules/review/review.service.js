const { Review, User } = require("../../models/index");
const { MENTOR } = require("../user/user.constant");

const postNewReview = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({
      isError: true,
      message: "User not found!",
    });
  }

  const mentor = await User.findOne({
    where: { id: req.body.mentorId, role: MENTOR },
  });
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
