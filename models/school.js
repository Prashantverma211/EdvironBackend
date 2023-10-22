const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
  balance: Number,
});

module.exports = mongoose.model("schools", schoolSchema);
