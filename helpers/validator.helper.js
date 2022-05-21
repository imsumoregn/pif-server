const Joi = require("joi");

const validateCreateMentor = (mentor) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    schools: Joi.array().items(Joi.string()).required(),
    exp: Joi.array().items(Joi.string()).required(),
    memberSince: Joi.date().raw(),
    hobbies: Joi.string(),
    offers: Joi.array().items(Joi.string()),
    domainKnowlegde: Joi.array().items(Joi.string()),
    bookingUrl: Joi.string(),
    facebookUrl: Joi.string(),
    linkedinUrl: Joi.string(),
    githubUrl: Joi.string(),
    avatarUrl: Joi.string(),
  });

  return schema.validate(mentor);
};

const validateUpdateMentor = (mentor) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    name: Joi.string(),
    schools: Joi.string(),
    exp: Joi.string(),
    memberSince: Joi.date().raw(),
    hobbies: Joi.string(),
    offers: Joi.array().items(Joi.string()),
    domainKnowlegde: Joi.array().items(Joi.string()),
    bookingUrl: Joi.string(),
    facebookUrl: Joi.string(),
    linkedinUrl: Joi.string(),
    githubUrl: Joi.string(),
    avatarUrl: Joi.string(),
  });

  return schema.validate(mentor);
};

const validateCreateMentee = (mentee) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    memberSince: Joi.date().raw(),
    dob: Joi.date().raw(),
    avatarUrl: Joi.string(),
    schools: Joi.array().items(Joi.string()),
    exp: Joi.array().items(Joi.string()),
  });

  return schema.validate(mentee);
};

const validateUpdateMentee = (mentee) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
    name: Joi.string(),
    memberSince: Joi.date().raw(),
    dob: Joi.date().raw(),
    bookingUrl: Joi.string(),
    isConfirmedEmail: Joi.boolean(),
    isActive: Joi.boolean(),
    avatarUrl: Joi.string(),
    schools: Joi.array().items(Joi.string()),
    exp: Joi.array().items(Joi.string()),
  });

  return schema.validate(mentee);
};

const validateLoginMentee = (mentee) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
  });

  return schema.validate(mentee);
};

module.exports = {
  validateCreateMentor,
  validateUpdateMentor,
  validateCreateMentee,
  validateUpdateMentee,
  validateLoginMentee,
};
