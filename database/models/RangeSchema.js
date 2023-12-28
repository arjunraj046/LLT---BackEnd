const mongoose = require("mongoose");

const RangeSchema = new mongoose.Schema({
  startRange: {
    type: Number,
    required: true,
  },
  endRange: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const RangeModel = mongoose.model("RangeModel", RangeSchema);

module.exports = RangeModel;
