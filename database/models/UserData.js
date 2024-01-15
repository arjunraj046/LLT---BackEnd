const mongoose = require("mongoose");
const { Schema } = mongoose;

const userDataSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tokenNumber: { type: String, required: true },
  count: { type: Number, required: true },
  date: {
    type: Date,
    default: () => new Date().toISOString()
  },
  drawTime:{type:String,required:true}
  
});

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;
