const Joi = require("joi");

const validateCreateUser = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required(),
        // method: Joi.string(),
        // description: Joi.string(),
        // phone: Joi.string(),
        // birthday: Joi.date().raw(),
        // exp: Joi.array().items(Joi.object()),
    });

    return schema.validate(user);
};

const validateCreateMentor = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required(),
        // method: Joi.string(),
        // description: Joi.string(),
        // phone: Joi.string(),
        // birthday: Joi.date().raw(),
        // exp: Joi.array().items(Joi.object()),
        // location: Joi.string(),
        // scopes: Joi.array().items(Joi.string()),
        // fields: Joi.array().items(Joi.string()),
        // offers: Joi.array().items(Joi.string()),
        // linkedin: Joi.string(),
        // github: Joi.string(),
        // bookingUrl: Joi.string(),
    });

    return schema.validate(user);
};

const validateLogIn = (user) => {
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

const validateChangePassword = (requestBody) => {
    const schema = Joi.object({
        currentPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required(),
        newPasswordConfirmation: Joi.string()
            .min(6)
            .valid(Joi.ref("newPassword")).required(),
    })

    return schema.validate(requestBody);
}

const validateReview = (requestBody) => {
    const schema = Joi.object({
        mentorId: Joi.string().required(),
        content: Joi.string().required(),
    })

    return schema.validate(requestBody);
}

module.exports = {
    validateCreateUser,
    validateLogIn,
    validateCreateMentor,
    validateUpdateMentor,
    validateUpdateUser,
    validateChangePassword,
    validateReview
};
