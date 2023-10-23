const { validationResult } = require("express-validator");
const Student = require("../models/student");
const Transaction = require("../models/transactions");
const Section = require("../models/section");
const Invoices = require("../models/invoices");
const School = require("../models/school");
const SchoolAdmin = require("../models/schoolAdmin");
const Dues = require("../models/dues");
const Payment = require("../models/payment");
const mongoose = require("mongoose");

const findDefaulter = async (schoolId) => {
  let defaulter = 0;
  const studentArr = await Student.find({ school_id: schoolId });

  for (const std of studentArr) {
    const duesArr = await Dues.find({ student: std._id }).countDocuments();
    const paymentArr = await Payment.find({
      student: std._id,
    }).countDocuments();
    if (duesArr > paymentArr) {
      defaulter += 1;
    }

    // for (const dues of duesArr) {
    //   const isDuesPresent = await Invoices.find({
    //     dues: dues._id,
    //   }).countDocuments();
    //   // console.log(isDuesPresent);

    //   if (!isDuesPresent) {
    //     defaulter += 1;
    //     break; // Exit the loop if no document is found
    //   }
    // }
  }

  return defaulter;
};
exports.getDefaulters = async (req, res, next) => {
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
    const totalDefaulters = await findDefaulter(schoolId);
    res.status(200).json({
      totalDefaulters,
    });
  } catch (err) {
    console.error(err);
  }
};
