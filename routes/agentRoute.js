const express = require("express");
const agentRoute = express.Router();
const { agentAuthMiddleware } = require("../middleware/authMiddleware");
const {
  addEntity,
  listEntity,
  deleteEntityAgent,
  listOrder,
  getOrders,
} = require("../controllers/agentController");

agentRoute.post("/entity", listEntity);
agentRoute.post("/order", listOrder);
agentRoute.post("/add-entity", addEntity);
agentRoute.post("/delete-entity-agent", deleteEntityAgent);
agentRoute.get("/get-orders", getOrders);

module.exports = agentRoute;
