const express = require("express");
const router = express.Router();

const { getAllScopes, addScopes } = require("./scope.controller");

router.get("/", getAllScopes);

router.post("/", addScopes);

module.exports = router;
