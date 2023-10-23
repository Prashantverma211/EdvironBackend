const express = require("express");
const router = express.Router();
const formController = require("../controllers/form");
const schoolAuthController = require("../controllers/authSchool");
const defaulterController = require("../controllers/findDefaulter");
const { check, body } = require("express-validator");

router.post("/form", formController.getAllSchoolInfo);
router.post("/idCheck", schoolAuthController.schoolInfo);
router.post("/findDefaulter", defaulterController.getDefaulters);
module.exports = router;
