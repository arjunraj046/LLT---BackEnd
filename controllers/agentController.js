const {
  addAgentDataDB,
  getAgentEntity,
  deleteEntity,
  getAgentOrders,
  getOrderIds,
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
    console.log("req.body", req.body);

    const { _id, drawTime,orderId, date, tokenSets } = req.body;

    let user = await getAgent(_id);
    console.log("user", user);

    if (user) {
      let result = await addAgentDataDB(_id, drawTime, date,orderId, tokenSets);
      console.log(result);
      res.status(200).json({ status: "success", result });
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

    res.status(200).json({ status: "success", listEntity:listEntity.data,total:listEntity.totalTokenCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listOrder = async (req, res) => {
  try {
    console.log("agent", req.body);
    const { _id } = req.body;
    const listOrder = await getAgentOrders(_id);
    if (listOrder == null) {
      res.status(500).json({ error: error.message });
    }
    res.status(200).json({ status: "success", listOrder });
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

const getOrders = async (req, res) => {
  try {
    const orderIds = await getOrderIds();
    res.status(200).json({  orderIds });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addEntity, listEntity,listOrder, deleteEntityAgent,getOrders };
