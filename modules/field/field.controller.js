const express = require("express");
const {getAllFields} = require("./field.service");

const router = express.Router();

router.get("/", getAllFields)

module.exports = router;