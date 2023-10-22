const { validationResult } = require("express-validator");
const Student = require("../models/student");
const Transaction = require("../models/transactions");
const Section = require("../models/section");
const Invoices = require("../models/invoices");
const School = require("../models/school");
const SchoolAdmin = require("../models/schoolAdmin");
const mongoose = require("mongoose");

exports.getSchoolInfo = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const errors = new Error();
    errors.message = error.errors[0].msg;
    errors.code = 422;
    errors.data = error.errors;
    throw errors;
  }
  const schoolId = req.body.schoolId;
  const className = req.body.className;
  let loadSchool;
  let totalSection = 0;
  let totalStudent = 0;
  let totalCollection = 0;
  let collThisMonth = 0;
  let fineCollTillDate = 0;
  let defaulters = 0;

  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    2
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );
  console.log(startOfMonth, endOfMonth);
  totalStudent = await Student.find({ school_id: schoolId }).countDocuments();

  let tmp = await Transaction.find({
    school: schoolId,
    status: "SUCCESS",
  });

  tmp.map((item) => {
    totalCollection += item.amount;
  });

  tmp = await Transaction.find({
    school: schoolId,
    status: "SUCCESS",
    createdAt: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  });
  tmp.map((item) => (collThisMonth += item.amount));

  totalSection = await Section.find({
    school_id: schoolId,
    class: className,
  }).countDocuments();

  tmp = await Invoices.find({ school: schoolId, status: "paid" });
  tmp.map((item) => {
    fineCollTillDate += item.fine_amount || 0;
  });

  const balance = await School.findById(schoolId);
  const cheque = await Transaction.find({
    school: schoolId,
    status: "SUCCESS",
    payment_mode: "CHEQUE",
  }).countDocuments();
  const online = await Transaction.find({
    school: schoolId,
    status: "SUCCESS",
    payment_mode: "ONLINE",
  }).countDocuments();
  const cash = await Transaction.find({
    school: schoolId,
    status: "SUCCESS",
    payment_mode: "CASH",
  }).countDocuments();

  const schoolAdminsTmp = await SchoolAdmin.find({ school_id: schoolId });
  const schoolAdmins = [];
  schoolAdminsTmp.map((item) => {
    console.log(item);
    schoolAdmins.push({
      name: item.name,
      access:
        item.access === "super"
          ? "Super Admin"
          : item.access === "all_access"
          ? "Admin"
          : "Management Staff",
    });
  });

  res.status(200).json({
    collThisMonth,
    totalCollection,
    totalSection,
    fineCollTillDate,
    totalStudent,
    balance: balance.balance,
    paymentMode: { online, cheque, cash },
    schoolAdmins,
  });
  console.log(totalStudent);
};
