const {
  agentRegisterDB,
  listAgentsDB,
  agentProfileEditDB,
  agentPasswordChangeDB,
  changeAgentStatusDB,
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
  deleteUserDB,
  listOrderDB,
} = require("../database/repository/adminRepository");
const { passwordHashing, passwordComparing } = require("../services/hasinging");
// const { getAgent } = require("../database/repository/authRepository");

const agentRegister = async (req, res) => {
  try {
    const { name, userName, contactNumber, email, password } = req.body;
    const hashedPassword = await passwordHashing(password);
    const newUser = await agentRegisterDB(
      name,
      userName,
      contactNumber,
      email,
      hashedPassword
    );
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
    console.log("body", req.body);
    const { _id, name, userName, email, contactNumber, status } = req.body;
    console.log(_id, name, userName, email, contactNumber, status);
    const updateUser = await agentProfileEditDB(
      _id,
      name,
      userName,
      email,
      contactNumber,
      status
    );
    res.status(200).json({
      status: "success",
      message: "Agent updated successfully",
      updateUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editPasswordAgent = async (req, res) => {
  try {
    const { _id, password } = req.body;
    // console.log(req.body);
    // const agentDetails = await agentDataDB(_id);
    // const pass = await passwordComparing(
    //   agentDetails.password,
    //   // previousPassword
    // );
    // if (pass) {
    const hashPassword = await passwordHashing(password);
    const data = await agentPasswordChangeDB(_id, hashPassword);
    // console.log(data)
    // console.log("success")
    res.status(200).json({
      status: "success",
      message: "Agent password change successfully",
      data,
    });
    // } else {
    //   return res.status(401).json({ error: "Password is incorrect!" });
    // }
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

// const listEntity = async (req, res) => {
//   try {
//     console.log("innn");
//     const { dateFilter } = req.query;
//     console.log(dateFilter);
//     const response = await listEntityDB('',dateFilter);
//     if (response && response.length > 0) {
//       const totalCount = response[0].totalCount;
//       const data = response[0].data;
//       console.log("Total Count:", totalCount, "Data:", data);
//       res.status(200).json({
//         status: "success",
//         list: data,
//         totalCount: totalCount,
//       });
//     } else {
//       // Handle the case where the response array is empty
//       res.status(200).json({
//         status: "success",
//         list: [],
//         totalCount: 0,
//       });
//     } } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
// };

const listEntitySearch = async (req, res) => {
  try {
    const { tokenNumber, dateFilter, drawTime, username } = req.query;

    console.log("Token Number:", tokenNumber);
    console.log("Date Filter:", dateFilter);
    console.log("drawTime:", drawTime);
    console.log("Username:", username); // New log for username

    // Call the function to fetch data from the database with tokenNumber, dateFilter, and username
    const response = await listEntityDB(tokenNumber, dateFilter, drawTime, username);

    if (response && response.length > 0) {
      const totalCount = response[0].totalCount;
      const data = response[0].data;
      console.log("Total Count:", totalCount, "Data:", data);
      res.status(200).json({
        status: "success",
        list: data,
        totalCount: totalCount,
      });
    } else {
      res.status(200).json({
        status: "success",
        list: [],
        totalCount: 0,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const listOrderSearch = async (req, res) => {
  try {
    const { tokenNumber, dateFilter, drawTime } = req.query;

    console.log("Token Number:", tokenNumber);
    console.log("Date Filter:", dateFilter);
    console.log("drawTime:", drawTime);

    // Call the function to fetch data from the database with tokenNumber and dateFilter
    const response = await listOrderDB(tokenNumber, dateFilter, drawTime);

    if (response && response.length > 0) {
    
      res.status(200).json({
        status: "success",
        list: response
      });
    } else {
      res.status(200).json({
        status: "success",
        list: [],
        totalCount: 0,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const entityCumulative = async (req, res) => {
  try {
    const { tokenNumber, dateFilter, drawTime } = req.query;

    console.log("Token Number:", tokenNumber);
    console.log("Date Filter:", dateFilter);
    const response = await entityCumulativeDB(
      tokenNumber,
      dateFilter,
      drawTime
    );
    // let totalCount = response[0].totalCount;
    // let data = response[0].data;
    console.log("res", response);
    res.status(200).json({ status: "success", response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rangeSetup = async (req, res) => {
  try {
    const { startRange, endRange, color } = req.body;
    const range = await rangeSetupDB(startRange, endRange, color);
    res.status(200).json({ status: "success", range });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const drawTimeSetup = async (req, res) => {
  try {
    const { time } = req.body;
    const drawTime = await drawTimeSetupDB(time);
    res.status(200).json({ status: "success", drawTime });
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

const drawTimeRangeList = async (req, res) => {
  try {
    console.log("Rang list");
    const drawTimeList = await drawTimeRangeListDB();
    console.log(drawTimeList);
    res.status(200).json({ status: "success", drawTimeList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteEntityAdmin = async (req, res) => {
  try {
    console.log("agent", req.body);
    const { id } = req.body;
    const result = await deleteEntityAdminDB(id);
    res.status(200).json({ status: "success", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDrawTime = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await deleteDrawTimeDB(id);

    res.status(200).json({ status: "success", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteColourSettings = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await deleteColourSettingsDB(id);

    res.status(200).json({ status: "success", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await deleteUserDB(id);
    res.status(200).json({ status: "success", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  agentRegister,
  agentList,
  agentDetails,
  editAgent,
  agentStatusChange,
  listEntitySearch,
  listOrderSearch,
  rangeSetup,
  rangeList,
  editPasswordAgent,
  deleteEntityAdmin,
  entityCumulative,
  drawTimeRangeList,
  drawTimeSetup,
  deleteDrawTime,
  deleteColourSettings,
  deleteUser,
};
