const mongoose = require("mongoose");

const DrawTimeSchema = new mongoose.Schema({
  drawTime: {
    type: String,
    required: true,
  },
});

const DrawRangeModel = mongoose.model("DrawRangeModel", DrawTimeSchema);

module.exports = DrawRangeModel;
