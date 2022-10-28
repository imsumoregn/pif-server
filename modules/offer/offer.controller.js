const express = require("express");
const {getAllOffers} = require("./offer.service");

const router = express.Router();

router.get("/", getAllOffers)

module.exports = router;
