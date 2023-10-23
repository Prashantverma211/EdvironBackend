const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
  balance: Number,
  name: String,
  _id: {
    type: mongoose.Types.ObjectId,
  },
});

module.exports = mongoose.model("schools", schoolSchema);
