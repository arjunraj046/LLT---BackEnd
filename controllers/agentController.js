const {
  addagentDataDB,
  getAgentEntity,
  deleteEntity,
} = require("../database/repository/agentRepository");
const { getAgent } = require("../database/repository/authRepository");

// const addEntity = async (req, res) => {
//   try {
//     console.log("hai add");
//     // const { date, tokenNumber, count } = req.body;
//     let id = '658a603d365ed61de6f39827'
//     let date = data.now()
//     let tokenNumber = 22
//     let count = 10
//     let res = await addagentDataDB(id, date, tokenNumber, count);
//     res.status(200).json({ status: "success",  res });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const addEntity = async (req, res) => {
  try {
    console.log("hai add", req.body);

    const { _id, values: { tokenSets } } = req.body;
    // let id = "658a603d365ed61de6f39827";
    // let date = Date.now(); // Fixed typo
    // let tokenNumber = 32;
    // let count = 40;
    let user = await getAgent(_id);

    if (user) {
      let result = await addagentDataDB(
        _id,
        date,
        tokenNumber,
        count,
        drawTime
      ); // Renamed variable to prevent conflict
      console.log(result);
      res.status(200).json({ status: "success", result }); // Sending result in response
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listEntity = async (req, res) => {
  try {
    console.log("agent", req.body);
    const { _id } = req.body;
    const listEntity = await getAgentEntity(_id);
    if (listEntity == null) {
      res.status(500).json({ error: error.message });
    }

    res.status(200).json({ status: "success", listEntity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEntityAgent = async (req, res) => {
  try {
    console.log("deleteagent", req.body);
    const { id } = req.body;
    const result = await deleteEntity(id);

    res.status(200).json({ status: "success", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addEntity, listEntity, deleteEntityAgent };
