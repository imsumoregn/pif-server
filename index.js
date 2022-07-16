require("dotenv").config();
const express = require("express");
const app = express();

const database = require("./models/index");
const environment = require("./environments/environment.local");
const logger = require("./setup/logger");

require("./setup/configuration")();

// if (environment.production) {
database.sequelize.sync();
// } else {
//   database.sequelize.sync({ force: true }).then(() => {
//     logger.info("Drop and re-sync database.");
//   });
// }

require("./setup/routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => logger.info(`Listening on port ${PORT}...`));
