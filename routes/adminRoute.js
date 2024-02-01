const express = require("express");
const adminRoute = express.Router();
// const { adminAuthMiddleware } = require("../middleware/authMiddleware");
const {
  agentRegister,
  agentList,
  agentDetails,
  editAgent,
  editPasswordAgent,
  agentStatusChange,
  // listEntity,
  listEntitySearch,
  rangeSetup,
  rangeList,
  deleteEntityAdmin,
  entityCumulative,
  drawTimeRangeList,
  drawTimeSetup,
  deleteDrawTime,
  deleteColourSettings,
  deleteUser,
  listOrderSearch,
} = require("../controllers/adminController");

adminRoute.get("/agent-list/:filter?/:pagenumber?", agentList);
adminRoute.post("/agent-register", agentRegister);
adminRoute.get("/agent/:id", agentDetails);
adminRoute.post("/edit-agent", editAgent);
adminRoute.post("/change-agentpassword", editPasswordAgent);
adminRoute.get("/agent-status-chnage/:id", agentStatusChange);
// adminRoute.get("/list-entity", listEntity);
adminRoute.get("/search-list-entity", listEntitySearch);
adminRoute.get("/search-list-order", listOrderSearch );
adminRoute.post("/enitity-rang", rangeSetup);
adminRoute.post("/draw-time", drawTimeSetup);
adminRoute.get("/enitity-rang-list", rangeList);
adminRoute.get("/enitity-draw-time-rang-list", drawTimeRangeList);
adminRoute.post("/delete-entity-admin", deleteEntityAdmin);
adminRoute.post("/delete-draw-time", deleteDrawTime);
adminRoute.post("/delete-user", deleteUser);
adminRoute.post("/delete-colour-settings", deleteColourSettings);
adminRoute.get("/list-entity-cumulative", entityCumulative);

module.exports = adminRoute;
