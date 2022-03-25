const winston = require("winston");
const { Sequelize } = require("sequelize");

const environment = require("../environments/environment.local");

const sequelize = new Sequelize(
  environment.database.name,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: environment.database.host,
    dialect: environment.database.dialect,
    logging: (message) => winston.debug(message),
  }
);

const database = {};
database.Sequelize = Sequelize;
database.sequelize = sequelize;

// define models in database
// ...

module.exports = database;
