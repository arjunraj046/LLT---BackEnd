const express = require("express");
const agentRoute = express.Router();
const { agentAuthMiddleware } = require("../middleware/authMiddleware");
const { addEntity, listEntity, deleteEntity } = require("../controllers/agentController");

agentRoute.post("/entity", listEntity);
agentRoute.post("/add-entity", addEntity);
agentRoute.post("/delete-entity", deleteEntity);

module.exports = agentRoute;
