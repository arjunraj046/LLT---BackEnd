const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new mongoose.Schema({
  tokenNumber: {
    type: String,
    required: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Orders",
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
