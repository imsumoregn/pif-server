const Joi = require("joi");

const validateCreateMentor = (mentor) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    schools: Joi.array().items(Joi.string()).required(),
    exp: Joi.array().items(Joi.string()).required(),
    memberSince: Joi.date().raw(),
    hobbies: Joi.string(),
    offers: Joi.string().required(),
    domainKnowlegde: Joi.string().required(),
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
    schools: Joi.array().items(Joi.string()),
    exp: Joi.array().items(Joi.string()),
    memberSince: Joi.date().raw(),
    hobbies: Joi.string(),
    offers: Joi.string(),
    domainKnowlegde: Joi.string(),
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
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    dob: Joi.date().raw(),
    schools: Joi.array().items(Joi.string()),
    exp: Joi.array().items(Joi.string()),
  });

  return schema.validate(mentee);
};

const validateUpdateMentee = (mentee) => {
  const schema = Joi.object({
    name: Joi.string(),
    dob: Joi.date().raw(),
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
