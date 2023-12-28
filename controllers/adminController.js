const {
  agentRegisterDB,
  listAgentsDB,
  agentProfileEditDB,
  agentPasswordChangeDB,
  changeAgentStatusDB,
  listEntityDB,
  rangeSetupDB,
  rangeListDB,
  agentDataDB,
} = require("../database/repository/adminRepository");
const { passwordHashing, passwordComparing } = require("../services/hasinging");
const { getAgent } = require("../database/repository/authRepository");

const agentRegister = async (req, res) => {
  try {
    const { name, userName, contactNumber, email, password } = req.body;
    const hashedPassword = await passwordHashing(password);
    const newUser = await agentRegisterDB(name, userName, contactNumber, email, hashedPassword);
    res.status(200).json({ status: "success", newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const agentList = async (req, res) => {
  try {
    const { filter = "all", pageNumber = 1 } = req.params;
    const agentList = await listAgentsDB(filter, pageNumber);
    res.status(200).json({ status: "success", agentList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const agentDetails = async (req, res) => {
  try {
    const id = req.params;
    console.log(id, "route is here ");
    const agentDetails = await agentDataDB(id);
    console.log(agentDetails);
    res.status(200).json({ status: "success", agentDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const editAgent = async (req, res) => {
  try {
    const { _id, name, userName, email, contactNumber } = req.body;
    console.log(_id, name, userName, email, contactNumber);
    const updateUser = await agentProfileEditDB(_id, name, userName, email, contactNumber);
    res.status(200).json({ status: "success", message: "Agent updated successfully", updateUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editPasswordAgent = async (req, res) => {
  try {
    const { _id, previousPassword, password } = req.body;
    // console.log(req.body);
    const agentDetails = await agentDataDB(_id);
    const pass = await passwordComparing(agentDetails.password, previousPassword);
    if (pass) {
      const hashPassword = await passwordHashing(password);
      const data = await agentPasswordChangeDB(_id, hashPassword);
      console.log(data);
      console.log("success");
      res.status(200).json({ status: "success", message: "Agent password change successfully", data });
    } else {
      return res.status(401).json({ error: "Password is incorrect!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const agentStatusChange = async (req, res) => {
  try {
    const id = req.params;
    const agent = await changeAgentStatusDB(id);
    res.status(200).json({ status: "success", agent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listEntity = async (req, res) => {
  try {
    const list = await listEntityDB();
    res.status(200).json({ status: "success", list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rangeSetup = async (req, res) => {
  try {
    const { startRange, endRange, color } = req.body;

    const rangeList = await rangeListDB();
    
    let flag = false;
    
    rangeList.map(async (item) => {
    
      if (startRange >= item.startRange && endRange <= item.endRange && color == item.color) {
    
        flag = true;
    
        return true;
    
      }
    
    });

    const range = 1;

    res.status(200).json({ status: "success", range });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rangeList = async (req, res) => {
  try {
    console.log("Rang list");
    const rangeList = await rangeListDB();
    console.log(rangeList);
    res.status(200).json({ status: "success", rangeList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { agentRegister, agentList, agentDetails, editAgent, agentStatusChange, listEntity, rangeSetup, rangeList, editPasswordAgent };
