const express = require("express");
const router = express.Router();

const { getAllFields, addFields } = require("./field.controller");

router.get("/", getAllFields);

router.post("/", addFields);

module.exports = router;
