const { verifyToken } = require("../services/token");
const { getAgent } = require("../database/repository/authRepository");

const agentAuthMiddleware = async (req, res, next) => {
  let token = req.header("Authorization");

  if (token) {
    token = token.replace(/^Bearer\s+/i, "");
    const isAuthenticated = verifyToken(token);

    if (isAuthenticated) {
      try {
        const user = await getAgent(isAuthenticated);

        if (user) {
          req.user = user;
          next();
        } else {
          res.status(401).json({ error: "Unauthorized" });
        }
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Authentication required." });
  }
};

const adminAuthMiddleware = async (req, res, next) => {
  let token = req.header("Authorization");
  if (token) {
    token = token.replace(/^Bearer\s+/i, "");
    const isAuthenticated = verifyToken(token);
    if (isAuthenticated) {
      try {
        const id = isAuthenticated.substr(5);
        const user = await checkUser(id);
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(401).json({ error: "Unauthorized" });
        }
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Authentication required." });
  }
};

module.exports = { agentAuthMiddleware, adminAuthMiddleware };
