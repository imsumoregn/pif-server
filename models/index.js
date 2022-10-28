"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const logger = require("../setup/logger");

const db = {};
let sequelize

sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
    }
);
(async () => {
    try {

        await sequelize.sync();
        logger.info("Drop and re-sync database.");

    } catch (error) {

        throw error

    }
})();

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require("./user")(sequelize, Sequelize);
db.Mentee = require("./mentee")(sequelize, Sequelize);
db.Mentor = require("./mentor")(sequelize, Sequelize);
db.Review = require("./review")(sequelize, Sequelize);
db.Field = require("./field")(sequelize, Sequelize);
db.Offer = require("./offer")(sequelize, Sequelize);

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
