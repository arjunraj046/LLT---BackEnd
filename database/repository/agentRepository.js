const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Assuming you have defined the UserData model somewhere before using it in addagentDataDB function
// const UserData = mongoose.model('UserData');
const UserData = require("../models/UserData");

const addagentDataDB = async (id, date, tokenNumber, count,drawTime) => {
  try {
    const userData = new UserData({
      userId: new ObjectId(id),
      tokenNumber: tokenNumber,
      count: count,
      date: date,
      drawTime:drawTime
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

    const list = await UserData.aggregate([
      {
        $match: { userId: _id }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'result'
        }
      }
    ]);

    if (!list || list.length === 0) {
      return null;
    }

    // Check if the result array has elements and extract the username
    const username = list[0].result[0].userName;

    // Flatten the structure and include userName in each document
    const modifiedList = list.map(item => {
      const { result, ...rest } = item;
      return { ...rest, userName: username };
    });

    console.log(modifiedList);
    return modifiedList;
  } catch (error) {
    console.error("Error fetching agent entities:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};



const deleteEntity = async (id) => {
  try {
    console.log("deleteAgentEntity in db ", id);
    const _id = new mongoose.Types.ObjectId(id);
    console.log(_id);
    const deleteItem = await UserData.deleteOne({ _id });
    return deleteItem;
  } catch (error) {
    console.error("Error fetching agent entities:", error);
    throw error;
  }
};

module.exports = { addagentDataDB, getAgentEntity, deleteEntity };
