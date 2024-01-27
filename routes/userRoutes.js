const express = require("express");
const router = express.Router();
const {
  updateUserPriority,
  getAllUsers,
  registerUser,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/users/register", registerUser); // New registration endpoint

// Middleware to authenticate JWT token
router.use(authMiddleware);
router.get("/users", getAllUsers); // New endpoint to get all users
router.patch("/users/priority", updateUserPriority);

module.exports = router;
