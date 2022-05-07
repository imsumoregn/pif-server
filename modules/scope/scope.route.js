const express = require("express");
const router = express.Router();

const { getAllScopes } = require("./scope.controller");

router.get("/", getAllScopes);

module.exports = router;