const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const Order = require("../models/OrderSchema");
const Token = require("../models/TokenSchema");

const addAgentDataDB = async (userId, drawTime, date, tokenList) => {
  try {
    const userOrder = new Order({
      userId: new ObjectId(userId),
      date: date,
      drawTime: drawTime,
    });

    console.log("userOrder is here", userOrder);

    const savedUserData = await userOrder
      .save()
      .then((res) => {
        console.log("Order saved successfully:", res);

        const tokenPromises = tokenList.map(async (token) => {
          const newToken = new Token({
            tokenNumber: parseInt(token.tokenNumber),
            count: parseInt(token.count),
            orderId: res._id,
          });

          return await newToken.save();
        });

        return Promise.all(tokenPromises);
      })
      .catch((error) => {
        console.error("Error saving order:", error);
        throw error;
      });

    return savedUserData;
  } catch (error) {
    throw error;
  }
};

const getAgentEntity = async (id) => {
  try {
    console.log("getAgentEntity in db ", id);
    const _id = new mongoose.Types.ObjectId(id);
    console.log(_id);

    const list = await Order.aggregate([
      {
        $match: {
          userId: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "tokens",
          localField: "_id",
          foreignField: "orderId",
          as: "token",
        },
      },
      {
        $unwind: {
          path: "$token",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          date: 1,
          drawTime: 1,
          tokenId: "$token._id",
          tokenNumber: "$token.tokenNumber",
          tokenCount: "$token.count",
        },
      },
    ]);

    if (!list || list.length === 0) {
      return null;
    } else {
      return list;
    }
  } catch (error) {
    console.error("Error fetching agent entities:", error);
    throw error;
  }
};

const getAgentOrders = async (id) => {
  try {
    const _id = new mongoose.Types.ObjectId(id);
    console.log(_id);

    const list = await Order.aggregate([
      {
        $match: {
          userId: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "tokens",
          localField: "_id",
          foreignField: "orderId",
          as: "token",
        },
      },
    ]);
    if (!list || list.length === 0) {
      return null;
    } else {
      return list;
    }
  } catch (error) {
    console.error("Error fetching agent entities:", error);
    throw error;
  }
};

const deleteEntity = async (orderId) => {
  try {
    console.log("deleteAgentOrder in db ", orderId);
    const _id = new mongoose.Types.ObjectId(orderId);
    console.log(_id);
    const deleteTokens = await Token.deleteMany({ orderId: _id });
    const deleteOrder = await Order.deleteOne({ _id });
    return { deleteTokens, deleteOrder };
  } catch (error) {
    console.error("Error fetching agent entities:", error);
    throw error;
  }
};

module.exports = {
  addAgentDataDB,
  getAgentEntity,
  getAgentOrders,
  deleteEntity,
};
