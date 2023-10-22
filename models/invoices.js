const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  school: {
    type: mongoose.Types.ObjectId,
  },
  fine_amount: Number,
});

module.exports = mongoose.model("Invoices", invoiceSchema);
