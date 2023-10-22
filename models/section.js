const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  school_id: {
    type: mongoose.Types.ObjectId,
  },
});

module.exports = mongoose.model("Sections", sectionSchema);
