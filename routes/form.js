const express = require("express");
const router = express.Router();
const formController = require("../controllers/form");
const { check, body } = require("express-validator");

router.post("/form", formController.getSchoolInfo);

module.exports = router;
