const { validationResult } = require("express-validator");
const School = require("../models/school");
const mongoose = require("mongoose");

function isTwelveByteString(str) {
  // Convert the string to a buffer using UTF-8 encoding
  const buffer = Buffer.from(str, "utf-8");
  console.log(buffer.length);
  // Check if the buffer's length is 12 bytes (96 bits)
  return buffer.length >= 12;
}

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
    console.log(schoolId);
    if (!isTwelveByteString(schoolId)) {
      throw new Error("School not found");
    }
    const loadSchool = await School.findOne({ _id: schoolId });
    if (!loadSchool) {
      throw new Error("School not found");
    }
    console.log(loadSchool);
    const schoolName = loadSchool.name;
    console.log(loadSchool.name);

    res.status(200).json({
      schoolName,
      schoolId,
    });
  } catch (err) {
    next(err);
  }
};
