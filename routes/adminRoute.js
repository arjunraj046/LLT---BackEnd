const express = require("express");
const adminRoute = express.Router();
const { agentRegister, agentList, agentDetails, editAgent,editPasswordAgent, agentStatusChange, listEntity, rangeSetup, rangeList } = require("../controllers/adminController");
const { adminAuthMiddleware } = require("../middleware/authMiddleware");

adminRoute.get("/agent-list/:filter?/:pagenumber?", agentList);
adminRoute.post("/agent-register", agentRegister);

adminRoute.get("/agent/:id", agentDetails);

adminRoute.post("/edit-agent", editAgent);
adminRoute.post("/change-agentpassword", editPasswordAgent);
adminRoute.get("/agent-status-chnage/:id", agentStatusChange);

adminRoute.get("/list-entity", listEntity);

adminRoute.post("/enitity-rang", rangeSetup);
adminRoute.get("/enitity-rang-list", rangeList);

module.exports = adminRoute;
