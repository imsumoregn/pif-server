const sgMail = require("@sendgrid/mail");
const handlebars = require("handlebars");

const { readHTMLFile } = require("../helpers/reader.helper");
const environment = require("../environments/environment.local");
const logger = require("./logger");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailConfirmationAccount = (account) => {
  readHTMLFile(
    `${__dirname}/../templates/email-confirmation.template.html`,
    (error, html) => {
      if (!error) {
        const template = handlebars.compile(html);
        const token = account.generateAuthToken();
        const replacements = {
          username: account.name,
          confirmUrl: `${environment.client}/user/verify-email?token=${token}`,
        };

        const htmlToSend = template(replacements);
        const options = {
          from: process.env.MAIL_USERNAME,
          to: account.email,
          subject:
            "Chào mừng đến với SheCodes Mentorship. Vui lòng xác thực tài khoản của bạn.",
          html: htmlToSend,
        };

        sgMail
          .send(options)
          .then((info) => {
            logger.info(info);
          })
          .catch((err) => {
            throw err;
          });
      }
    }
  );
};

const mailResetPassword = (account) => {
  readHTMLFile(
    `${__dirname}/templates/email-reset-password.template.html`,
    (error, html) => {
      const template = handlebars.compile(html);
      const token = account.generateTemporaryAuthToken();
      const replacements = {
        username: account.name,
        confirmUrl: `${environment.client}/user/password-recovered?token=${token}`,
      };

      const htmlToSend = template(replacements);
      const options = {
        from: process.env.MAIL_USERNAME,
        to: account.email,
        subject: "Khôi phục mật khẩu - SheCodes Mentorship",
        html: htmlToSend,
      };

      sgMail
        .send(options)
        .then((info) => {
          logger.info(info);
        })
        .catch((err) => {
          throw err;
        });
    }
  );
};

module.exports = { mailConfirmationAccount, mailResetPassword };
