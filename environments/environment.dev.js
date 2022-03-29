const environment = {
  production: false,
  apiUrl: "http://localhost:8080",
  client: "http://localhost:3000",
  gateway: {
    mentor: {
      url: "http://localhost:8080/api/mentors",
    },
    mentee: {
      url: "http://localhost:8080/api/mentees",
    },
  },
  log: {
    general: "../logs/development/general.dev.log",
    exception: "../logs/development/uncaught-exception.dev.log",
    rejection: "../logs/development/unhandled-rejection.dev.log",
  },
  database: {
    name: "mentorship_dev",
    host: "localhost",
    dialect: "postgres",
  },
};

module.exports = environment;