const _ = require("lodash");
const { Op } = require("sequelize");

const { User } = require("../../models/index");
const {
  DEFAULT_PAGE,
  DEFAULT_NUMBER_OF_ITEMS,
} = require("../shared/shared.constant");
const { FieldType } = require("../field/field.constant");
const { ScopeType } = require("../scope/scope.constant");
const { MENTOR } = require("../user/user.constant");

const filterMentor = async (req, res) => {
  // let fields = req.body.fields;
  // let scopes = req.body.scopes;
  // const page = req.body.page || DEFAULT_PAGE;
  // const itemsPerPage = req.body.itemsPerPage || DEFAULT_NUMBER_OF_ITEMS;
  // let mentors;
  // if (!scopes?.length && !fields?.length) {
  //   mentors = await Mentor.findAll({
  //     offset: (page - 1) * itemsPerPage,
  //     limit: itemsPerPage,
  //   });
  // } else {
  //   if (fields.length && fields.includes(FieldType.OTHER)) {
  //     const otherFields = await Field.findAll({ where: { isDefined: false } });
  //     fields = _.concat(
  //       fields,
  //       otherFields?.map((field) => field.name)
  //     );
  //     _.remove(fields, (field) => field === FieldType.OTHER);
  //   }
  //   if (scopes.length && scopes.includes(ScopeType.OTHER)) {
  //     const otherScopes = await Scope.findAll({ where: { isDefined: false } });
  //     scopes = _.concat(
  //       scopes,
  //       otherScopes?.map((scope) => scope.name)
  //     );
  //     _.remove(scopes, (scope) => scope === ScopeType.OTHER);
  //   }
  //   scopes = scopes?.map((scope) => `%${scope}%`);
  //   fields = fields?.map((field) => `%${field}%`);
  //   if (fields.length && !scopes.length) {
  //     mentors = await Mentor.findAll({
  //       where: {
  //         domainKnowlegde: {
  //           [Op.like]: {
  //             [Op.any]: fields,
  //           },
  //         },
  //       },
  //       offset: (page - 1) * itemsPerPage,
  //       limit: itemsPerPage,
  //     });
  //   } else if (!fields.length && scopes.length) {
  //     mentors = await Mentor.findAll({
  //       where: {
  //         offers: {
  //           [Op.like]: {
  //             [Op.any]: offers,
  //           },
  //         },
  //       },
  //       offset: (page - 1) * itemsPerPage,
  //       limit: itemsPerPage,
  //     });
  //   } else {
  //     mentors = await Mentor.findAll({
  //       where: {
  //         [Op.and]: [
  //           {
  //             domainKnowlegde: {
  //               [Op.like]: {
  //                 [Op.any]: fields,
  //               },
  //             },
  //           },
  //           {
  //             offers: {
  //               [Op.like]: {
  //                 [Op.any]: scopes,
  //               },
  //             },
  //           },
  //         ],
  //       },
  //       offset: (page - 1) * itemsPerPage,
  //       limit: itemsPerPage,
  //     });
  //   }
  // }
  // return res.status(200).json({
  //   isError: false,
  //   data: mentors,
  //   message: "Get mentors successfully.",
  // });
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
