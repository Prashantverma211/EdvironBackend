const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  student: {
    type: mongoose.Types.ObjectId,
  },
});

module.exports = mongoose.model("payments", paymentSchema);
