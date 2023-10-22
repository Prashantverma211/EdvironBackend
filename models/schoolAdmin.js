const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schoolAdminSchema = new Schema({
  school_id: {
    type: mongoose.Types.ObjectId,
  },
  name: String,
  access: String,
});

module.exports = mongoose.model("schooladmins", schoolAdminSchema);
