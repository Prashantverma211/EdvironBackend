const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  school_id: {
    type: mongoose.Types.ObjectId,
  },
  _id: {
    type: mongoose.Types.ObjectId,
  },
});

module.exports = mongoose.model("Students", studentSchema);
