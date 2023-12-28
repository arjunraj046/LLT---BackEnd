const User = require("../models/User");
const UserData = require("../models/UserData");
const RangeSchema = require("../models/RangeSchema");
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

const agentProfileEditDB = async (_id, name, userName, email, contactNumber) => {
  try {
    const updateUserinfo = { name, userName, email, contactNumber };
    const updatedAgent = await User.findByIdAndUpdate(_id, updateUserinfo, { new: true });
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
    console.log("DB",Agent);
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

const listEntityDB = async () => {
  try {
    const list = await UserData.aggregate([
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
        },
      },
    ]);

    if (!list) return null;
    return list;
  } catch (error) {
    throw error;
  }
};

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

const rangeListDB = async () => {
  try {
    const ranges = await RangeSchema.find();
    return ranges;
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

module.exports = { agentRegisterDB, listAgentsDB, agentProfileEditDB, changeAgentStatusDB, agentPasswordChangeDB, listEntityDB, rangeSetupDB, rangeListDB, agentDataDB };
