const {Review} = require("../../models/index");
const {MENTOR} = require("../user/user.constant");
const {validateReview} = require("../../helpers/validator.helper");

const menteePostReview = async (req, res, next) => {

    if (req.context.user.dataValues.role === MENTOR) {

        const error = new Error('Forbidden. Only a mentee can post a review.');
        error.status = 403;
        throw error

    }

    const {error: joiError} = validateReview(req.body);

    if (joiError) {

        const error = new Error(joiError.details[0].message.replace(/\"/g, "'"));
        error.status = 400;
        throw error

    }

    const newReview = await Review.create({
        menteeId: req.context.user.dataValues.id,
        mentorId: req.body.mentorId,
        content: req.body.content,
    });

    return res.status(200).json({
        isError: false,
        data: newReview.dataValues,
        message: "Post review successfully.",
    });

};

module.exports = {menteePostReview};
