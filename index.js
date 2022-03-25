require("dotenv").config();
const winston = require("winston");
const express = require("express");
const app = express();

require("./start-up/configuration")();
require("./start-up/logger")();
require("./start-up/database")();
require("./start-up/routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => winston.info(`Listening on port ${PORT}...`));
