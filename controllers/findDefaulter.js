const { validationResult } = require("express-validator");
const Student = require("../models/student");
const Transaction = require("../models/transactions");
const Section = require("../models/section");
const Invoices = require("../models/invoices");
const School = require("../models/school");
const SchoolAdmin = require("../models/schoolAdmin");
const Dues = require("../models/dues");
const Payment = require("../models/payment");

function hasTimePassed(givenTimestamp) {
  const givenDate = new Date(givenTimestamp);

  const currentDate = new Date();

  return currentDate > givenDate;
}

const fundDefaulter2 = async (schoolId) => {
  let defaulter = 0;
  const totalStudentInSchoolIdsArr = (
    await Student.find({ school_id: schoolId })
  ).map((itr) => itr._id);
  for (const std of totalStudentInSchoolIdsArr) {
    const dueArr = await Dues.find({
      student: std,
      due_date: { $lt: new Date() },
    }).countDocuments();
    const paymentArr = await Payment.find({
      student: std._id,
    }).countDocuments();
    if (dueArr > paymentArr) {
      defaulter += 1;
    }
    return defaulter;
  }
};
const findDefaulter = async (schoolId) => {
  const studentIds = await Student.find({ school_id: schoolId }).distinct(
    "_id"
  );

  const result = await Dues.aggregate([
    {
      $match: {
        student: { $in: studentIds },
        due_date: { $lt: new Date() },
      },
    },
    {
      $group: {
        _id: "$student",
        duesCount: { $sum: 1 },
      },
    },
  ]);

  const payments = await Payment.aggregate([
    {
      $match: {
        student: { $in: studentIds },
      },
    },
    {
      $group: {
        _id: "$student",
        paymentsCount: { $sum: 1 },
      },
    },
  ]);

  let defaulter = 0;

  for (const resultItem of result) {
    const studentId = resultItem._id;
    const duesCount = resultItem.duesCount;
    const paymentsCount = payments.find((p) => p._id.equals(studentId));

    if (!paymentsCount || duesCount > paymentsCount.paymentsCount) {
      defaulter += 1;
    }
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
