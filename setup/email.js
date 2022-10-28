const {readFile} = require("fs/promises");
const sgMail = require("@sendgrid/mail");
const handlebars = require("handlebars");

const environment = require("../environments/environment.local");
const logger = require("./logger");
const {
    RESET_PASSWORD_TOKEN,
    CONFIRM_EMAIL_TOKEN,
} = require("../modules/user/user.constant");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendConfirmRegisteringEmailMail = async (account) => {

    let html;

    try {

        html = await readFile(
            `${__dirname}/../templates/email-confirmation.template.html`,
            {encoding: "utf-8"},
        );

    } catch (readError) {

        throw readError;

    }

    const template = handlebars.compile(html);

    const token = account.generateAuthToken(CONFIRM_EMAIL_TOKEN);
    const replacements = {
        username: account.name,
        confirmUrl: `${environment.client}/verify?token=${token}`,
    };

    const htmlToSend = template(replacements);

    const options = {
        from: process.env.MAIL_USERNAME,
        to: account.email,
        subject:
            "Chào mừng đến với SheCodes Mentorship. Vui lòng xác thực tài khoản của bạn.",
        html: htmlToSend,
    };

    try {

        const responseMailService = await sgMail.send(options);
        logger.info(responseMailService);

    } catch (error) {

        throw error;

    }

};

const sendConfirmPasswordResetMail = async (account) => {

    let html;

    try {

        html = await readFile(
            `${__dirname}/templates/email-reset-password.template.html`,
            {encoding: "utf-8"},
        );

    } catch (readError) {

        throw readError;

    }

    const template = handlebars.compile(html);

    const token = account.generateAuthToken(RESET_PASSWORD_TOKEN);
    const replacements = {
        username: account.name,
        confirmUrl: `${environment.client}/user/reset-password?token=${token}`,
    };

    const htmlToSend = template(replacements);

    const options = {
        from: process.env.MAIL_USERNAME,
        to: account.email,
        subject: "Khôi phục mật khẩu - SheCodes Mentorship",
        html: htmlToSend,
    };

    try {

        const responseMailService = await sgMail.send(options);
        logger.info(responseMailService);

    } catch (error) {

        throw error;

    }


};

module.exports = {
    sendConfirmRegisteringEmailMail,
    sendConfirmPasswordResetMail,
};
