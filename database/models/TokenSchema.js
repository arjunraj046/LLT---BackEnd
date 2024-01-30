const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  tokenNumber: {
    type: String,
    required: true,
  },
  count: {
    type: String,
    required: true,
  },
  drawTime: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
