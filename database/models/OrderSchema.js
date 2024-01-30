const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tokenList: [
    {
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
        default: Date.now,
      },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
