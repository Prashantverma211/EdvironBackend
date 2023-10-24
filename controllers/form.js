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

function numberFormat(num, type) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    notation: "compact",
    compactDisplay: "long",
  });
  return formatter.format(num);
}
const formattedNumber = (number) => {
  return number.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

exports.getAllSchoolInfo = async (req, res, next) => {
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

  totalStudent = totalStudent.toLocaleString("en-IN", {
    // style: "currency",
    // currency: "INR",
    // minimumFractionDigits: 2,
    maximumFractionDigits: 0,
  });
  let tmp = await Transaction.find({
    school: schoolId,
    status: "SUCCESS",
  });

  tmp.map((item) => {
    totalCollection += item.amount || 0;
  });
  totalCollection = numberFormat(totalCollection);
  tmp = await Transaction.find({
    school: schoolId,
    status: "SUCCESS",
    createdAt: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  });
  tmp.map((item) => (collThisMonth += item.amount || 0));
  collThisMonth = numberFormat(collThisMonth);
  totalSection = await Section.find({
    school_id: schoolId,
    class: className,
  }).countDocuments();

  tmp = await Invoices.find({ school: schoolId, status: "paid" });
  tmp.map((item) => {
    fineCollTillDate += item.fine_amount || 0;
  });
  fineCollTillDate = numberFormat(fineCollTillDate);
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
      name: item?.name || "",
      access:
        item.access === "super"
          ? "Super Admin"
          : item.access === "all_access"
          ? "Admin"
          : "Management Staff",
    });
  });
  const disbursalTmp = await Transaction.find({ school: schoolId })
    .sort({ updateAt: -1 })
    .limit(5);
  const disbursal = [];
  disbursalTmp.map((item) => {
    console.log(item);
    disbursal.push({
      date: new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(item.updatedAt),
      amount: formattedNumber(item.amount),
      status: item.status === "SUCCESS" ? "Successful" : "Pending",
    });
  });

  res.status(200).json({
    collThisMonth,
    totalCollection,
    totalSection,
    fineCollTillDate,
    totalStudent,
    balance: numberFormat(balance?.balance || 0),
    paymentMode: { online, cheque, cash },
    schoolAdmins,
    disbursal,
  });
  console.log(totalStudent);
};
