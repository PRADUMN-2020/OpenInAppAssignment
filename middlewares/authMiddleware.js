const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

// Middleware for authenticating JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  // Skip authentication for registration route
  if (req.path === "/users/register") {
    return next();
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // console.log("token", token);
    const decoded = jwt.verify(token, jwtSecret);
    req.userID = decoded.userID;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = authMiddleware;
