const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Assuming you have defined the UserData model somewhere before using it in addagentDataDB function
// const UserData = mongoose.model('UserData');
const UserData = require("../models/UserData");

const addagentDataDB = async (id, date, tokenNumber, count) => {
  try {
    const userData = new UserData({
      userId: new ObjectId(id),
      tokenNumber: tokenNumber,
      count: count,
      date: date,
    });

    const savedUserData = await userData.save();
    return savedUserData;
  } catch (error) {
    throw error;
  }
};

// const UserData = require("../models/UserData");
// // const { ObjectId } = require("mongoose").Types;

// const addagentDataDB = async (id, date, tokenNumber, count) => {
//   try {
//     const UserData = mongoose.model('UserData');

//     const userData = new UserData({
//       userId: ObjectId(id),
//       tokenNumber: tokenNumber,
//       count: count,
//       date: date,
//     });

//     const savedUserData = await userData.save();
//     return savedUserData;
//   } catch (error) {
//     throw error;
//   }
// };

// const getAgentEntity = async (id) => {
//   try {
//     console.log("getAgentEntity in db ", id);
//     let _id = new mongoose.Types.ObjectId(id);
//     console.log(_id);
//     const list = await UserData.find({ userId: _id });
//     console.log(list);
//     if (!list) return null;
//     return list;
//   } catch (error) {
//     throw error;
//   }
// };
const getAgentEntity = async (id) => {
  try {
    console.log("getAgentEntity in db ", id);
    const _id = new mongoose.Types.ObjectId(id);
    console.log(_id);

    const list = await UserData.find({ userId: _id });

    if (!list || list.length === 0) {
      return null;
    }

    console.log(list);
    return list;
  } catch (error) {
    console.error("Error fetching agent entities:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

module.exports = { addagentDataDB, getAgentEntity };
