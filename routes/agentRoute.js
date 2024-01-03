const express = require("express");
const agentRoute = express.Router();
const { agentAuthMiddleware } = require("../middleware/authMiddleware");
const { addEntity, listEntity, deleteEntityAgent } = require("../controllers/agentController");

agentRoute.post("/entity", listEntity);
agentRoute.post("/add-entity", addEntity);
agentRoute.post("/delete-entity-agent", deleteEntityAgent);

module.exports = agentRoute;
