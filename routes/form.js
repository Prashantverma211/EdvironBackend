const express = require("express");
const router = express.Router();
const formController = require("../controllers/form");
const schoolAuthController = require("../controllers/authSchool");
const defaulterController = require("../controllers/findDefaulter");
const graphController = require("../controllers/graph");
const { check, body } = require("express-validator");

router.post("/form", formController.getAllSchoolInfo);
router.post("/idCheck", schoolAuthController.schoolInfo);
router.post("/findDefaulter", defaulterController.getDefaulters);
router.post("/findGraphData",graphController.getGraphData);
module.exports = router;
