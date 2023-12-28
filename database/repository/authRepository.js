const User = require("../models/User");

const clientLoginDB = async (userName) => {
  try {
    const user = await User.findOne({ userName });
    if (!user) return null;
    return user;
  } catch (error) {
    console.error("Error during Authentication:", error);
    throw error;
  }
};
const getAgent = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) return null;
    return user;
  } catch (error) {
    console.error("Error during Authentication:", error);
    throw error;
  }
};

module.exports = { clientLoginDB, getAgent };
