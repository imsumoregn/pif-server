const Joi = require("joi");

const validateCreateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    role: Joi.string().required(),
    method: Joi.string(),
    description: Joi.string(),
    phone: Joi.string(),
    birthday: Joi.date().raw(),
    exp: Joi.array().items(Joi.object()),
  });

  return schema.validate(user);
};

const validateCreateMentor = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    role: Joi.string().required(),
    method: Joi.string(),
    description: Joi.string(),
    phone: Joi.string(),
    birthday: Joi.date().raw(),
    exp: Joi.array().items(Joi.object()),
    location: Joi.string(),
    scopes: Joi.array().items(Joi.string()),
    fields: Joi.array().items(Joi.string()),
    offers: Joi.array().items(Joi.string()),
    linkedin: Joi.string().required(),
    github: Joi.string(),
    bookingUrl: Joi.string(),
  });

  return schema.validate(user);
};

const validateLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
  });

  return schema.validate(user);
};

const validateUpdateMentor = (user) => {
  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    phone: Joi.string(),
    birthday: Joi.date().raw(),
    exp: Joi.array().items(Joi.object()),
    location: Joi.string(),
    scopes: Joi.array().items(Joi.string()),
    fields: Joi.array().items(Joi.string()),
    offers: Joi.array().items(Joi.string()),
    linkedin: Joi.string(),
    github: Joi.string(),
    bookingUrl: Joi.string(),
  });

  return schema.validate(user);
};

const validateUpdateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    phone: Joi.string(),
    birthday: Joi.date().raw(),
    exp: Joi.array().items(Joi.object()),
  });

  return schema.validate(user);
};

module.exports = {
  validateCreateUser,
  validateLogin,
  validateCreateMentor,
  validateUpdateMentor,
  validateUpdateUser,
};
