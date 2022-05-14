const environment = {
  production: true,
  client: "https://shecodes-mentorship.vercel.app",
  server: "",
  log: {
    general: "../logs/production/general.log",
    exception: "../logs/production/uncaught-exception.log",
    rejection: "../logs/production/unhandled-rejection.log",
  },
};

module.exports = environment;
