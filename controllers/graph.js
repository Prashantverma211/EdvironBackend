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

// exports.getGraphData = async (req, res, next) => {
//   try {
//     const schoolId = req.body.schoolId;
//     const currentDate = new Date();
//     const startOfMonth = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       2
//     );
//     const endOfMonth = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() + 1,
//       1
//     );
//     let collThisMonth = 0;
//     const tmp = await Transaction.find({
//       school: schoolId,
//       status: "SUCCESS",
//       createdAt: {
//         $gte: startOfMonth,
//         $lt: endOfMonth,
//       },
//     });
//     tmp.map((item) => (collThisMonth += item.amount || 0));
//     collThisMonth = numberFormat(collThisMonth);
//   } catch (err) {
//     console.error(err);
//   }
// };

exports.getGraphData = async (req, res, next) => {
  try {
    const schoolId = req.body.schoolId;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthlyCollections = [];

    // let monthlyCollArr = [];

    for (let month = 0; month <= currentMonth; month++) {
      const startOfMonth = new Date(currentYear, month, 1);
      const endOfMonth = new Date(currentYear, month + 1, 0);

      const tmp = await Transaction.find({
        school: schoolId,
        status: "SUCCESS",
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });

      let collThisMonth = 0;
      tmp.map((item) => (collThisMonth += item.amount || 0));

      monthlyCollections.push({
        year: currentYear,
        month: month,
        collection: collThisMonth,
      });
    }
    const monthlyCollArr = monthlyCollections.map((itr) => itr.collection || 0);
    for (let i = 0; i < 12 - monthlyCollections.length; i++) {
      monthlyCollArr.push(0);
    }
    const totalCollThisYr = monthlyCollArr.reduce((acc, itr) => acc + itr, 0);
    res.status(200).json({
      monthlyCollArr,
      totalCollThisYr,
    });
  } catch (err) {
    console.error(err);
  }
};
