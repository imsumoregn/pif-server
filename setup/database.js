const { Sequelize } = require("sequelize");

const environment = require("../environments/environment.local");
const logger = require("./logger");

const sequelize = new Sequelize(
  environment.database.name,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: environment.database.host,
    dialect: environment.database.dialect,
    logging: (message) => logger.debug(message),
  }
);

const database = {};
database.Sequelize = Sequelize;
database.sequelize = sequelize;

// define models in database
// ...

module.exports = database;
