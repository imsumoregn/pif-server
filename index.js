require("dotenv").config();
const winston = require("winston");
const express = require("express");
const app = express();

require("./setup/configuration")();
require("./setup/logger")();
require("./setup/database")();
require("./setup/routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => winston.info(`Listening on port ${PORT}...`));
