const express = require("express");
const router = express.Router();

const { getAllFields } = require("./field.controller");

router.get("/", getAllFields);

module.exports = router;