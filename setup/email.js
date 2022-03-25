const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const winston = require("winston");

const { readHTMLFile } = require("../helpers/reader.helper");
const environment = require("../environments/environment.local");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.MAIL_SERVER,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const confirmationAccount = (account) => {
  readHTMLFile(
    `${__dirname}/templates/email-confirmation.template.html`,
    (error, html) => {
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

      transporter.sendMail(options, (err, info) => {
        if (err) {
          throw err;
        }
        winston.info(info);
      });
    }
  );
};
