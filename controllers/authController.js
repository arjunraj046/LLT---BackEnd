const { clientLoginDB } = require("../database/repository/authRepository");
const { generateToken } = require("../services/token");
const { passwordComparing } = require("../services/hasinging");

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await clientLoginDB(userName);
    const isPasswordValid = await passwordComparing(user.password, password);
    console.log(user,isPasswordValid);
    if (!user.status) {
      return res.status(401).json({ error: "User is Blocked" });
    }
    if (!user || !isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    let token;
    if (user.userRole == 1) {
      // token generate for admin
      token = generateToken("admin" + user._id);
    } else {
      // token generate for agent
      token = generateToken(user._id);
    } 
    res.status(200).json({ status: "success", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };
