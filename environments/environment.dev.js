const environment = {
  production: false,
  client: "http://localhost:3000",
  server: `http://localhost:${process.env.PORT || 8080}`,
  log: {
    general: "../logs/development/general.dev.log",
    exception: "../logs/development/uncaught-exception.dev.log",
    rejection: "../logs/development/unhandled-rejection.dev.log",
  },
};

module.exports = environment;
