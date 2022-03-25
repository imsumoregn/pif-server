export const environment = {
  production: true,
  apiUrl: "",
  gateway: {
    mentor: {
      url: "",
    },
    mentee: {
      url: "",
    },
  },
  log: {
    general: "/logs/production/general.log",
    exception: "/logs/production/uncaught-exception.log",
    rejection: "/logs/production/unhandled-rejection.log",
  },
  database: {
    name: "mentorship",
    host: "",
    dialect: "postgres",
  },
  allowOrigins: [],
};
