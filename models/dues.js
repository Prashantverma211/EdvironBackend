const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dueSchema = new Schema({
    student:{
        type:mongoose.Types.ObjectId
    }
});

module.exports = mongoose.model("dues", dueSchema);
