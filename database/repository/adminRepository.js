const User = require("../models/User");
const UserData = require("../models/UserData");
const RangeSchema = require("../models/RangeSchema");
const DrawTimeSchema = require("../models/DrawTimeSchema");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const agentRegisterDB = async (name, userName, contactNumber, email, hashedPassword) => {
  try {
    const newUser = new User({ name, userName, contactNumber, email, password: hashedPassword, userRole: 2, status: true });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Error during user registration:", error);
    throw error;
  }
};

const listAgentsDB = async (filter, pageNumber) => {
  try {
    // const perPage = 5;
    // const skip = (pageNumber - 1) * perPage;

    let filterCondition = {};
    if (filter === "active") {
      filterCondition = { status: true };
    } else if (filter === "inactive") {
      filterCondition = { status: false };
    }

    const users =
      filter === "all"
        ? await User.find({ userRole: 2 }) // .limit(perPage).skip(skip)
        : await User.find({ ...filterCondition, userRole: 2 });
    // .limit(perPage).skip(skip);

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const agentProfileEditDB = async (
  _id,
  name,
  userName,
  email,
  contactNumber,status
) => {
  try {
    const updateUserinfo = { name, userName, email, contactNumber ,status};
    const updatedAgent = await User.findByIdAndUpdate(_id, updateUserinfo, {
      new: true,
    });
    return updatedAgent;
  } catch (error) {
    console.error("Error editing agent profile:", error);
    throw error;
  }
};

const agentPasswordChangeDB = async (_id, password) => {
  try {
    console.log("agentPasswordChangeDB");
    const updateUserinfo = { password };
    const Agent = await User.findByIdAndUpdate(_id, updateUserinfo, { new: true });
    console.log("DB", Agent);
    return Agent;
  } catch (error) {
    console.error("Error editing agent passoword:", error);
    throw error;
  }
};

const changeAgentStatusDB = async (id) => {
  try {
    const agent = await User.findOne({ _id: id });

    if (agent) {
      const updatedAgent = await User.findOneAndUpdate({ _id: id }, { $set: { status: !agent.status } }, { new: true });
      return updatedAgent;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error changing agent status:", error);
    throw error;
  }
};
const listEntityDB = async (tokenNumberr, dateFilterr,drawTime) => {
  try {

    console.log("inn db",dateFilterr);
    let tokenNumber = parseInt(tokenNumberr);

    let matchStage = {};

    if (tokenNumber) {
      matchStage.tokenNumber = tokenNumber;
    }
    if (drawTime) {
      matchStage.drawTime = drawTime;
    }
    if (dateFilterr) {
      const startDate = new Date(`${dateFilterr}T00:00:00.000Z`);
      const endDate = new Date(`${dateFilterr}T23:59:59.999Z`);
      matchStage.date = { $gte: startDate, $lte: endDate };
    }

    // console.log("ms", matchStage);

    let aggregationPipeline = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "data",
        },
      },
      {
        $unwind: {
          path: "$data",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          tokenNumber: 1,
          count: 1,
          date: 1,
          name: "$data.name",
          userName: "$data.userName",
          contactNumber: "$data.contactNumber",
          email: "$data.email",
          userRole: "$data.userRole",
          status: "$data.status",
          drawTime:"$drawTime",
        },
      },
      {
        $group: {
          _id: null,
          totalCount: {
            $sum: "$count",
          },
          data: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          totalCount: 1,
          data: 1,
        },
      },
    ];

    const list = await UserData.aggregate(aggregationPipeline);

    console.log(list);
    if (!list) return null;

    return list;
  } catch (error) {
    throw error;
  }
};

// const listEntitySearchDB = async (token, dateFilter) => {
//   try {
//     let tokenNumber = parseInt(token);

//     let matchStage = {};

//     if (tokenNumber) {
//       matchStage.tokenNumber = tokenNumber;
//     }

//     if (dateFilter) {
//       matchStage.date = {
//         $gte: new Date(dateFilter),
//         $lt: new Date(new Date(dateFilter).setHours(23, 59, 59, 999)),
//       };
//     }

//     let aggregatePipeline = [
//       {
//         $match: matchStage,
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "data",
//         },
//       },
//       {
//         $unwind: {
//           path: "$data",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           userId: 1,
//           tokenNumber: 1,
//           count: 1,
//           date: 1,
//           name: "$data.name",
//           userName: "$data.userName",
//           contactNumber: "$data.contactNumber",
//           email: "$data.email",
//           userRole: "$data.userRole",
//           status: "$data.status",
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalCount: {
//             $sum: "$count",
//           },
//           data: {
//             $push: "$$ROOT",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           totalCount: 1,
//           data: 1,
//         },
//       },
//     ];

//     console.log("Aggregate Pipeline:", JSON.stringify(aggregatePipeline, null, 2));

//     const list = await UserData.aggregate(aggregatePipeline);

//     console.log("Aggregate Result:", JSON.stringify(list, null, 2));

//     if (!list || list.length === 0) {
//       console.error("Error: Aggregate result is undefined or empty");
//       return { totalCount: 0, data: [] };
//     }

//     const result = Array.isArray(list) ? list[0] : list;

//     if (!result || !result.data) {
//       console.error("Error: Aggregate result has an incorrect structure");
//       console.log("Detailed Error:", JSON.stringify(result, null, 2));
//       return { totalCount: 0, data: [] };
//     }

//     const { totalCount, data } = result;

//     console.log("Total Count:", totalCount, "Data:", JSON.stringify(data, null, 2));

//     return { totalCount, data };
//   } catch (error) {
//     console.error("Error in listEntitySearchDB:", error);
//     throw error;
//   }
// };

const entityCumulativeDB = async ( tokenNumberr,dateFilter,drawTime) => {
  try {
    let tokenNumber = parseInt(tokenNumberr);

    let matchStage = {};

    if (tokenNumber) {
      matchStage.tokenNumber = tokenNumber;
    }
    if (drawTime) {
      matchStage.drawTime = drawTime;
    }
    if (dateFilter) {
      const startDate = new Date(`${dateFilter}T00:00:00.000Z`);
      const endDate = new Date(`${dateFilter}T23:59:59.999Z`);
      matchStage.date = { $gte: startDate, $lte: endDate };
    }
    console.log('ms',matchStage);
    const pipeline = [
      // Match documents based on filter parameters
      {
        $match: matchStage,
      },
      // Group by tokenNumber
      {
        $group: {
          _id: '$tokenNumber',
          total: { $sum: '$count' },
        },
      },
      {
        $sort: { total: -1 },
      }
      
    ];

    const results = await UserData.aggregate(pipeline);
    return results;
  } catch (error) {
    throw error;
  }
};

  // MongoDB aggregation pipeline to calculate cumulative counts
   


const rangeSetupDB = async (startRange, endRange, color) => {
  try {
    const newRange = new RangeSchema({
      startRange,
      endRange,
      color,
    });
    const savedRange = await newRange.save();
    return savedRange;
  } catch (error) {
    throw error;
  }
};
const drawTimeSetupDB = async (drawTime) => {
  try {
    const newdrawTime = new DrawTimeSchema({
      drawTime
    });
    const saveddrawTime = await newdrawTime.save();
    return saveddrawTime;
  } catch (error) {
    throw error;
  }
};

const rangeListDB = async () => {
  try {
    const ranges = await RangeSchema.find();
    return ranges;
  } catch (error) {
    throw error;
  }
};
const { DateTime } = require('luxon');

const drawTimeRangeListDB = async () => {
  try {
    const currentDateTime = new Date();
    console.log('Current Time:', currentDateTime);

    const currentMinutes = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();

    const drawTimeList = await DrawTimeSchema.aggregate([
      {
        $addFields: {
          drawTimeMinutes: {
            $add: [
              { $multiply: [{ $toInt: { $substr: ['$drawTime', 0, 2] } }, 60] }, // hours to minutes
              { $toInt: { $substr: ['$drawTime', 3, 2] } }, // add minutes
            ],
          },
        },
      },
      {
        $addFields: {
          timeDifference: {
            $cond: {
              if: { $gte: ['$drawTimeMinutes', currentMinutes] },
              then: { $subtract: ['$drawTimeMinutes', currentMinutes] },
              else: { $add: [1440, '$drawTimeMinutes'] }, // add 24 hours if the draw time is earlier
            },
          },
        },
      },
      { $sort: { timeDifference: 1 } },
      { $project: { _id: 1, drawTime: 1 } }
    ]);

    console.log('Sorted Draw Times:', drawTimeList);

    return drawTimeList;
  } catch (error) {
    throw error;
  }
};



const agentDataDB = async (id) => {
  try {
    let _id = new mongoose.Types.ObjectId(id);

    const agent = await User.findOne(_id);
    return agent;
  } catch (error) {
    throw error;
  }
};
const deleteEntityAdminDB = async (id) => {
  try {
    console.log("deleteAdminEntity in db ", id);
    const _id = new mongoose.Types.ObjectId(id);
    console.log(_id);
    const deleteItem = await UserData.deleteOne({ _id });
    return deleteItem;
  } catch (error) {
    console.error("Error fetching agent entities:", error);
    throw error;
  }
};
const deleteDrawTimeDB = async (id) => {
  try {
    console.log("deletedeleteDrawTimeDB in db ", id);
    const _id = new mongoose.Types.ObjectId(id);
    console.log(_id);
    const deleteItem = await DrawTimeSchema.deleteOne({ _id });
    return deleteItem;
  } catch (error) {
    console.error("Error fetching agent entities:", error);
    throw error;
  }
};
const deleteColourSettingsDB = async (id) => {
  try {
    console.log("deleteColourSettingsDB in db ", id);
    const _id = new mongoose.Types.ObjectId(id);
    console.log(_id);
    const deleteItem = await RangeSchema.deleteOne({ _id });
    return deleteItem;
  } catch (error) {
    console.error("Error fetching agent entities:", error);
    throw error;
  }
};
const deleteUserDB = async (id) => {
  try {
    console.log("deleteUserDB in db ", id);
    const _id = new mongoose.Types.ObjectId(id);
    console.log(_id);
    
    // Add await here
    const tickets = await UserData.deleteMany({ userId: _id });
    console.log(tickets);

    const deleteItem = await User.deleteOne({ _id });
    return deleteItem;
  } catch (error) {
    console.error("Error fetching agent entities:", error);
    throw error;
  }
};


module.exports = {
  agentRegisterDB,
  listAgentsDB,
  agentProfileEditDB,
  changeAgentStatusDB,
  agentPasswordChangeDB,
  listEntityDB,
  entityCumulativeDB,
  rangeSetupDB,
  rangeListDB,
  agentDataDB,
  deleteEntityAdminDB,
  drawTimeRangeListDB,
  drawTimeSetupDB,
  deleteDrawTimeDB,
  deleteColourSettingsDB,
  deleteUserDB
};
