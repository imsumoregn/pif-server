const { v4: uuid } = require("uuid");
const _ = require("lodash");
const validator = require("validator");

const { Mentor, sequelize, Field, Scope } = require("../../models/index");
const { bucket } = require("../../setup/firebase");
const {
  validateCreateMentor,
  validateUpdateMentor,
} = require("../../helpers/validator.helper");
const { DEFAULT_PAGE, DEFAULT_NUMBER_OF_ITEMS } = require("../shared/constant");
const { Op } = require("sequelize");
const { FieldType } = require("../field/field.constant");
const { ScopeType } = require("../scope/scope.constant");
const Joi = require("joi");

const getAllMentors = async (req, res) => {
  const mentors = await Mentor.findAll();
  return res.status(200).json({
    isError: false,
    data: mentors,
    message: "Get all mentors successfully.",
  });
};

const getMentorById = async (req, res) => {
  if (!validator.isUUID(req.params.id, 4)) {
    return res.status(400).json({
      isError: true,
      message: "Id is not a valid UUID(v4)!",
    });
  }

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
    return res.status(400).json({
      isError: true,
      message: error.details[0].message.replace(/\"/g, "'"),
    });
  }

  let mentor = await Mentor.findOne({ where: { email: req.body.email } });
  if (mentor) {
    return res
      .status(400)
      .json({ isError: true, message: "Email already exists!" });
  }

  mentor = req.body;
  mentor.schools = mentor.schools.map((data) => data.trim());
  mentor.exp = mentor.exp.map((data) => data.trim());
  mentor.offers = mentor.offers?.map((data) => data.trim());
  mentor.domainKnowlegde = mentor.domainKnowlegde?.map((data) => data.trim());

  const newMentor = Mentor.build(req.body);

  try {
    const result = await sequelize.transaction(async (t) => {
      const fields = await Field.findAll();
      mentor.offers?.forEach(async (offer) => {
        if (!_.find(fields, { name: offer.trim() })) {
          await Field.build({ name: offer.trim() }).save();
        }
      });

      const scopes = await Scope.findAll();
      mentor.domainKnowlegde?.forEach(async (domain) => {
        if (!_.find(scopes, { name: domain.trim() })) {
          await Scope.build({ name: domain.trim() }).save();
        }
      });

      await newMentor.save({ transaction: t });
      return true;
    });
  } catch (error) {
    throw error;
  }

  return res.status(200).json({
    isError: false,
    data: newMentor,
    message: "Create mentor successfully.",
  });
};

const updateMentorById = async (req, res) => {
  if (!validator.isUUID(req.params.id, 4)) {
    return res.status(400).json({
      isError: true,
      message: "Id is not a valid UUID(v4)!",
    });
  }

  const { error } = validateUpdateMentor(req.body);
  if (error) {
    return res.status(400).json({
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
        .json({ isError: true, message: "Email already exists!" });
    }
  }

  req.body.schools = req.body.schools?.map((data) => data.trim());
  req.body.exp = req.body.exp?.map((data) => data.trim());
  req.body.offers = req.body.offers?.map((data) => data.trim());
  req.body.domainKnowlegde = req.body.domainKnowlegde?.map((data) =>
    data.trim()
  );

  try {
    const fields = await Field.findAll();
    req.body.offers?.forEach(async (offer) => {
      if (!_.find(fields, { name: offer.trim() })) {
        await Field.build({ name: offer.trim() }).save();
      }
    });

    const scopes = await Scope.findAll();
    req.body.domainKnowlegde?.forEach(async (domain) => {
      if (!_.find(scopes, { name: domain.trim() })) {
        await Scope.build({ name: domain.trim() }).save();
      }
    });

    await mentor.update(req.body);
  } catch (error) {
    throw error;
  }

  return res.status(200).json({
    isError: false,
    data: mentor,
    message: "Update mentor successfully.",
  });
};

const deleteMentorById = async (req, res) => {
  if (!validator.isUUID(req.params.id, 4)) {
    return res.status(400).json({
      isError: true,
      message: "Id is not a valid UUID(v4)!",
    });
  }

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

const updateMentorAvatar = async (req, res) => {
  if (!validator.isUUID(req.params.id, 4)) {
    return res.status(400).json({
      isError: true,
      message: "Id is not a valid UUID(v4)!",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      isError: true,
      message: "No files have been uploaded!",
    });
  }

  const mentor = await Mentor.findByPk(req.params.id);
  if (!mentor) {
    return res.status(404).json({
      isError: true,
      message: "Mentor not found!",
    });
  }

  const token = uuid();
  const imageStorageName = `${new Date().getTime()}_${req.file.originalname}`;

  const blob = bucket.file(imageStorageName);
  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  blobWriter.on("error", (err) => {
    throw err;
  });

  blobWriter.on("finish", async () => {
    await mentor.update({
      avatarUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${imageStorageName}?alt=media&token=${token}`,
    });

    res.status(200).json({
      isError: false,
      message: "Update avatar successfully.",
      data: mentor,
    });
  });

  blobWriter.end(req.file.buffer);
};

const filterMentor = async (req, res) => {
  const { fields, scopes } = req.body;
  const page = req.body.page || DEFAULT_PAGE;
  const itemsPerPage = req.body.itemsPerPage || DEFAULT_NUMBER_OF_ITEMS;
  let mentors;

  if (!scopes?.length && !fields?.length) {
    mentors = await Mentor.findAll({
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
    });
  } else {
    if (fields.length && fields.includes(FieldType.OTHER)) {
      const otherFields = await Field.findAll({ where: { isDefined: false } });
      fields = _.concat(
        fields,
        otherFields?.map((field) => field.name)
      );
      _.remove(fields, (field) => field === FieldType.OTHER);
    }

    if (scopes.length && scopes.includes(ScopeType.OTHER)) {
      const otherScopes = await Scope.findAll({ where: { isDefined: false } });
      scopes = _.concat(
        scopes,
        otherScopes?.map((scope) => scope.name)
      );
      _.remove(scopes, (scope) => scope === ScopeType.OTHER);
    }

    if (fields.length && !scopes.length) {
      mentors = await Mentor.findAll({
        where: {
          domainKnowlegde: {
            [Op.like]: {
              [Op.any]: fields,
            },
          },
        },
        offset: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
      });
    } else if (!fields.length && scopes.length) {
      mentors = await Mentor.findAll({
        where: {
          offers: {
            [Op.like]: {
              [Op.any]: scopes,
            },
          },
        },
        offset: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
      });
    } else {
      mentors = await Mentor.findAll({
        where: {
          [Op.and]: [
            {
              domainKnowlegde: {
                [Op.like]: {
                  [Op.any]: fields,
                },
              },
            },
            {
              offers: {
                [Op.like]: {
                  [Op.any]: scopes,
                },
              },
            },
          ],
        },
        offset: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
      });
    }
  }

  return res.status(200).json({
    isError: false,
    data: mentors,
    message: "Get mentors successfully.",
  });
};

module.exports = {
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentorById,
  deleteMentorById,
  updateMentorAvatar,
  filterMentor,
};
