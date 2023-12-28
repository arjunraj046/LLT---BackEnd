const express = require("express");
const authrouter = express.Router();
const { login } = require("../controllers/authController");

authrouter.post("/login", login);

module.exports = authrouter;
