const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    school: {
      type: mongoose.Types.ObjectId,
    },
    status: String,
    amount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transactions", transactionSchema);
