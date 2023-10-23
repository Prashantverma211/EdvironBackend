const { validationResult } = require("express-validator");
const School = require("../models/school");
const mongoose = require("mongoose");

exports.schoolInfo = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const errors = new Error();
      errors.message = error.errors[0].msg;
      errors.code = 422;
      errors.data = error.errors;
      throw errors;
    }
    const schoolId = req.body.schoolId;
    const loadSchool = await School.find({ _id: schoolId });
    const schoolName = loadSchool[0].name;
    console.log(loadSchool[0].name);

    res.status(200).json({
      schoolName,
      schoolId,
    });
  } catch (err) {
    console.error(err);
  }
};
