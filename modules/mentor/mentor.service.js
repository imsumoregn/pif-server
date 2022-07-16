const _ = require("lodash");
const { Op } = require("sequelize");

const { User, Offer } = require("../../models/index");
const {
  DEFAULT_PAGE,
  DEFAULT_NUMBER_OF_ITEMS,
} = require("../shared/shared.constant");
const { FieldType } = require("../field/field.constant");
const { MENTOR } = require("../user/user.constant");
const { OfferConstant } = require("../offer/offer.constant");

const filterMentor = async (req, res) => {
  let fields = req.body.fields || [];
  let offers = req.body.offers || [];
  const page = req.body.page || DEFAULT_PAGE;
  const itemsPerPage = req.body.itemsPerPage || DEFAULT_NUMBER_OF_ITEMS;
  let results;

  if (!offers?.length && !fields?.length) {
    results = await Mentor.findAndCountAll({
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
    });
  } else {
    if (fields.length && fields.includes(FieldType.OTHERS)) {
      const otherFields = await Field.findAll({ where: { isDefined: false } });
      fields = _.concat(
        fields,
        otherFields?.map((field) => field.key)
      );
      _.remove(fields, (field) => field === FieldType.OTHERS);
    }

    if (offers.length && offers.includes(OfferConstant.OTHERS)) {
      const otherOffers = await Offer.findAll({ where: { isDefined: false } });
      offers = _.concat(
        offers,
        otherOffers?.map((offer) => offer.key)
      );
      _.remove(offers, (offer) => offer === OfferConstant.OTHERS);
    }

    offers = offers.map((offer) => {
      return { offers: { [Op.contains]: [offer] } };
    });
    fields = fields.map((field) => {
      return { fields: { [Op.contains]: [field] } };
    });

    if (fields.length && !offers.length) {
      results = await Mentor.findAndCountAll({
        where: {
          [Op.or]: fields,
        },
        offset: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
      });
    } else if (!fields.length && offers.length) {
      results = await Mentor.findAndCountAll({
        where: {
          [Op.or]: offers,
        },
        offset: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
      });
    } else {
      results = await Mentor.findAndCountAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: fields,
            },
            {
              [Op.or]: offers,
            },
          ],
        },
        offset: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
      });
    }
  }

  const users = await Promise.all(
    results?.rows.map(async (mentor) => {
      return await User.findByPk(mentor.userId);
    })
  );

  for (let i = 0; i < users.length; i++) {
    users[i] = _.omit(Object.assign(users[i], results.rows[i]), ["password"]);
  }

  return res.status(200).json({
    isError: false,
    data: users,
    message: "Get mentors successfully.",
    total: results?.count || 0,
  });
};

const getAllReviewsByMentorId = async (req, res) => {
  const mentor = await User.findOne({
    where: { id: req.params.mentorId, role: MENTOR },
  });
  if (!mentor) {
    return res.status(404).json({
      isError: true,
      message: "Mentor not found!",
    });
  }

  const { rows, count } = await Review.findAndCountAll({
    where: { mentorId: req.params.mentorId },
  });

  return res.status(200).json({
    isError: false,
    data: rows,
    total: count,
    message: `Get all reviews of mentor ${mentor.name} successfully.`,
  });
};

module.exports = {
  filterMentor,
  getAllReviewsByMentorId,
};
