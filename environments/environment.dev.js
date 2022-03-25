export const environment = {
  production: false,
  apiUrl: "http://localhost:8080",
  gateway: {
    mentor: {
      url: "http://localhost:8080/api/mentors",
    },
    mentee: {
      url: "http://localhost:8080/api/mentees",
    },
  },
  log: {
    general: "/logs/development/general.log",
    exception: "/logs/development/uncaught-exception.log",
    rejection: "/logs/development/unhandled-rejection.log",
  },
  database: {
    name: "mentorship_dev",
    host: "localhost",
    dialect: "postgres",
  },
  allowOrigins: ["localhost:3000"],
};
